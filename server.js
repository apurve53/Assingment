const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
require('dotenv').config();
// const { createProxyMiddleware } = require('http-proxy-middleware');
// const { PendingOrder, CompletedOrder, sequelize, DataTypes, Sell, Buy, getPendingOrders, getCompletedOrders } = require('./tables/index');
const upload = multer({ dest: 'uploads/' });
const { insertUser, addUserChat, findUser, getUserChat, handleResetChat, checkUser, getSampleChat } = require('./db');
const algorithm = 'aes-256-ctr';
const sec_for_crypto = process.env.SEC_FOR_CRYPTO
const iv = crypto.randomBytes(16);
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(sec_for_crypto, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return encrypted.toString('hex');
}
function decrypt(hash) {
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(sec_for_crypto, 'hex'), Buffer.from(iv.toString('hex'), 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
  // console.log("tis is butter", decrypted);
  return decrypted.toString();
}
const app = express();
// const users = [];
/*
app.use(
  '/',
  createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
  })
);
*/
const store = new session.MemoryStore();
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SEC_FOR_PROT_SERVER,
  name: 'sessionId',
  resave: false,
  cookie: { maxAge: 600000 }, // Set "secure" to true if using HTTPS
  saveUninitialized: false,
  store
}));

app.use(express.urlencoded({ extended: false }));
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true // Enable cookies and other credentials in requests
};
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Request Methode : ${req.method} - ${req.url}`)
  next();
})
const server = http.createServer(app);
//------------------------------------------------------------------------Web-Socket Area --------------------------------------------------------------------------------------------------
const wss = new WebSocket.Server({ server });
const connectedUsers = []
wss.on('connection', (ws, req) => {
  ws.on('error', console.error);
  const ip = req.socket.remoteAddress;
  // console.log("ipAddress is :", ip);
  connectedUsers.push({ userIP: ip, userChatData: [] });
  // console.log('New client connected');
  ws.on('message', (message) => {
    // console.log(`Received: ${message}`);
    ws.send("We are connected Now");
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log(`${message}`);
        client.send(`${message}`);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const defUserAuthentication = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
  if (token) {
    jwt.verify(token, secretKey, (err) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.userroll = userrole;
      if (applications) {
        req.userapplications = applications;
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
const isAuthanticated = (req, res, next) => {
  console.log("session : ", req.session.userDetails);
  next();
}
app.get('/', (req, res) => {
  req.session.userDetails = { authanticated: false, applications: [], user: "" };
  res.redirect('http://localhost:3000');
})

app.post('/login', isAuthanticated, async (req, res) => {
  const { username, password } = req.body;
  try{

    if (req.session.userDetails.authanticated == false) {
      const userStatus = await findUser(username, password)
      if (!userStatus.user) {
        res.status(402);
      } else {
        req.session.userdetails = { authanticated: true, applications: ["chat"], user: username };
        res.status(200).json({ user: encrypt(username) });
      }
    }
  }catch(err){
    
  }
  })

app.post('/signup', async (req, res) => {
  const { name, username, password } = req.body;
  if (await checkUser(username)) {
    return res.status(400).send("User is already Exist");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let insertion = await insertUser({ name, username, 'password': hashedPassword, 'chat': {} })
    if (insertion.acknowledged) {
      let userDetails = { authanticated: true, applications: ["chat"], user: username };
      req.session.userdetails = userDetails;
      res.status(200).json({ user: encrypt(username) });
    } else {
      res.status(500).end();
    }
  } catch (error) {
    res.status(500).send('Error registering user');
  }
})

app.post('/userchat', async (req, res) => {
  let hashedUser = req.body.user;
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(sec_for_crypto, 'hex'), Buffer.from(iv.toString('hex'), 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hashedUser, 'hex')), decipher.final()]);
  let userchat = await getUserChat({ user: decrypted.toString() });
  res.status(200).json(userchat);
})

app.post('/clientchatadd', async (req, res) => {
  if (req.body.user) {
    let userchat = req.body.chat;
    let isUpdated = await addUserChat({ "user": decrypt(req.body.user), 'chat': userchat })
    if (isUpdated.matchedCount == 1) {
      res.status(200).json({ 'user': req.body.user });
    }
  } else {
    res.status(401).json({ 'message': "Unauthorized" })

  }
})
app.post('/resetchat', async (req, res) => {
  if (req.body.samplechat) {
    res.status(200).json({ samplechat: await getSampleChat() })
  } else {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(sec_for_crypto, 'hex'), Buffer.from(iv.toString('hex'), 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(req.body.user, 'hex')), decipher.final()]);
    let result = await handleResetChat({ user: decrypted.toString() });
    result ? res.status(200).end() : res.status(401).end();
  }
})
server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001/');
});