const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');
const cors = require('cors');
const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const localAddress = require("./osModule");
require('dotenv').config();
// const { createProxyMiddleware } = require('http-proxy-middleware');
const { sendMessageToUser, insertUser, addUserChat, findUser, getUserChat, handleResetChat, checkUser, getSampleChat } = require('./db');
const { encrypt, decrypt } = require('./EncriptDecript');
const { Options } = require('typedoc');
const algorithm = 'aes-256-ctr';
const sec_for_crypto = process.env.SEC_FOR_CRYPTO
const store = new session.MemoryStore();

const app = express();
/*
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
  })
);
*/
app.use(bodyParser.json());
app.use(express.static('uploads'));
app.use(express.static('build'));
app.use(session({
  secret: process.env.SEC_FOR_PROT_SERVER,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,          // Only send over HTTPS
    httpOnly: false,        // access via JavaScript
    maxAge: 1000 * 60 * 60, // 1 hour expiry
    sameSite: 'None',
    path: '/',             // Valid for all paths
    signed: true,
  },
}));
app.use((req, res, next) => {
  const origin = req.get('Origin') || req.get('Referer');
  console.log("asdasd : ", origin);
  console.log(`Request Methode : ${req.method}`);
  console.log(`Session with request with ${req.url} : `, req.session);
  console.log("req.url : ", req.url);
  if (req.body) {
    console.log(req.body);
  } else if (req.params) {
    console.log("Parameater is : ", req.params);
  }
  console.log("")
  console.log("")
  // if (req.method === 'OPTIONS') {
  //   res.setHeader('Access-Control-Allow-Origin', origin);
  //   res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  //   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //   res.setHeader('Access-Control-Allow-Credentials', true);
  //   return res.status(204).end();
  // }
  next();
})
app.use(express.urlencoded({ extended: false }));
const corsOptions = {
  origin: ['https://apurve53.github.io', 'https://localhost:3004', 'http://localhost:3001', 'http://127.0.0.1:5502', 'https://localhost:3000'],
  credentials: true
};
//app.use(cors(corsOptions));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from any origin
    callback(null, origin || '*');
  }, credentials: true
}));
app.use(express.json());

const options = {
  key: fs.readFileSync(__dirname + '/key.pem'),
  cert: fs.readFileSync(__dirname + '/cert.pem')
};
const server = https.createServer(options, app);
console.log(__dirname);
app.get('/', (req, res) => {
  console.log("Starting session : ", req.session);
  req.session.userDetails = { authanticated: false, applications: [], user: "new user" };
  res.redirect('https://apurve53.github.io');
  // res.redirect('https://localhost:3000');
  // res.sendFile(path.join(__dirname, 'build', 'indexe.html'));
})
app.get('*', (req, res) => {
  // console.log("Starting session : ", req.session);
  // req.session.userDetails = { authanticated: false, applications: [], user: "new user" };
  // res.redirect('https://apurve53.github.io');
  // res.redirect('https://localhost:3000');
  res.sendFile(path.join(__dirname, 'build', 'indexe.html'));
})

app.post('/login', async (req, res) => {
  console.log("Login Sesstion : ", req.session);
  const { username, password } = req.body;
  try {
    if (req.session.userDetails.authanticated === false) {
      const userStatus = await findUser(username, password);
      if (!userStatus.user) {
        res.status(402);
      } else {
        let encUserName = encrypt(username);
        req.session.userDetails = { authanticated: true, applications: ["supportchat"], user: encUserName };
        res.status(200).json({ user: encUserName });
      }
    }
  } catch (err) {
    console.log("err : ", err);
  }
})

app.post('/signup', async (req, res) => {
  console.log(`checked and it was working for signup route : `);
  const { name, username, password, website } = req.body;
  if (await checkUser(username)) {
    return res.status(400).send("User is already Exist");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let insertion = await insertUser({ name, username, 'password': hashedPassword, 'chat': {}, "website": website })
    if (insertion) {
      corsOptions.origin.push(website);
      let userEnc = encrypt(username);
      req.session.userDetails.authanticated = true;
      req.session.userDetails.applications.push("supportchat");
      req.session.userDetails.user = userEnc;
      if (await checkUser(username)) {
        res.status(200).json({ user: userEnc });
      }
    } else {
      res.status(500).end();
    }
  } catch (error) {
    console.log("there is error of somthing :", error);
    res.status(500).send('Error registering user');
  }
})
app.get('/chatcreate', (req, res) => {
  console.log("asas");
  req.session.clientDetail = { user: req.query.user }
  res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
  res.sendFile(path.join(__dirname, 'public', 'chatcreate.js'));
})

app.post('/userchat', async (req, res) => {
  let userSession = req.session.clientDetail;
  try {
    if (req.body.user || userSession?.user) {
      let hashedUser = req.body.user ? req.body.user : userSession.user;
      let userchat = await getUserChat({ user: decrypt(hashedUser) });
      res.setHeader("Content-type", "application/json");
      if (Object.keys(userchat).length > 0) {
        res.status(200).json(userchat);
      } else {
        res.status(200).json({});
      }
    }
  } catch (e) {
    console.log("Error while sending response for asking user chat : ", e);
  }
})


app.post('/clientchatadd', async (req, res) => {
  let data = req.body;
  if (data.user) {
    let userchat = req.body.chat;
    let isUpdated = await addUserChat({ "user": decrypt(data.user), 'chat': userchat })
    if (isUpdated.matchedCount == 1) {
      res.status(200).json({ 'user': req.body.user });
    }
  } else {
    res.status(401).json({ 'message': "Unauthorized" })

  }
  // } else {
  //   res.status(401).end();
  // }
})

app.post('/resetchat', async (req, res) => {
  if (req.session.userDetails.user) {
    if (req.body.samplechat) {
      res.status(200).json({ samplechat: await getSampleChat() })
    } else {
      let result = await handleResetChat({ user: decrypt(req.body.user) });
      result ? res.status(200).end() : res.status(401).end();
    }
  } else {
    res.status(419).end();
  }
})

app.post('/logoutuser', async (req, res) => {
  req.session.destroy(function (err) {
    res.status(200).end();
  });
  console.log("After Logout the sesstion : ", req.session);
})
//------------------------------------------------------------------------Web-Socket Area --------------------------------------------------------------------------------------------------
// const wss = new WebSocket.Server({ server });
// const connectedUsers = []
// wss.on('connection', (ws, req) => {
//   ws.on('error', console.error);
//   const ip = req.socket.remoteAddress;
//   // console.log("ipAddress is :", ip);
//   connectedUsers.push({ userIP: ip, userChatData: [] });
//   // console.log('New client connected');
//   ws.on('message', (message) => {
//     // console.log(`Received: ${message}`);
//     ws.send("We are connected Now");
//     wss.clients.forEach((client) => {
//       if (client !== ws && client.readyState === WebSocket.OPEN) {
//         console.log(`${message}`);
//         client.send(`${message}`);
//       }
//     });
//   });

//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });
server.listen(443, localAddress.runningIp, () => {
  // console.log('Server is running on https://localhost:443/');
  console.log(`My Client is running on https://${localAddress.runningIp}:443   100.158.126.103`);
});