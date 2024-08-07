const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const XLSX = require('xlsx');
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
  if (req.session.userDetails.authanticated == false) {
    const userStatus = await findUser(username, password)
    if (!userStatus.user) {
      res.status(402);
    } else {
      req.session.userdetails = { authanticated: true, applications: ["chat"], user: username };
      res.status(200).json({ user: encrypt(username) });
    }
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
/*
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const workbook = XLSX.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    const sellData = data.filter(item => item['Buyer Qty']);
    const buyData = data.filter(item => item['Seller Qty']);
    await Sell.bulkCreate(sellData.map(item => ({
      quantity: item['Buyer Qty'],
      price: item['Buyer Price'],
    })));

    await Buy.bulkCreate(buyData.map(item => ({
      quantity: item['Seller Qty'],
      price: item['Seller Price'],
    })));

    res.send('File processed successfully');
  } catch (e) {
    res.send(e)
  }

});
app.post('/transaction', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let { type, quantity, price } = req.body;
    quantity = parseInt(quantity);
    let tempValue = quantity;
    price = parseInt(price);
    if (type === 'sell') {
      let allBuy = await Buy.findAll({ lock: true, transaction });
      for (let buy of allBuy) {
        if (price === buy.price) {
          if (quantity > buy.quantity) {
            await CompletedOrder.create({ price, quantity }, { transaction });
            quantity -= buy.quantity;
            await buy.destroy({ transaction });
          } else if (quantity === buy.quantity) {
            await CompletedOrder.create({ price, quantity }, { transaction });
            await buy.destroy({ transaction });
            quantity = 0;
            break;
          } else if (quantity < buy.quantity) {
            buy.quantity -= quantity;
            await buy.save({ transaction });
            quantity = 0;
            break;
          }
        }
      }
      if (quantity > 0) {
        await Sell.create({ price, quantity }, { transaction });
      }

    } else if (type === 'buy') {
      let allSell = await Sell.findAll({ lock: true, transaction });
      for (let sell of allSell) {
        if (price === sell.price) {
          if (quantity < sell.quantity) {
            sell.quantity -= quantity;
            await sell.save({ transaction });
            quantity = 0;
            break;
          } else if (quantity === sell.quantity) {
            await sell.destroy({ transaction });
            quantity = 0;
            break;
          } else if (quantity > sell.quantity) {
            quantity -= sell.quantity;
            await sell.destroy({ transaction });
          }
        }
      }
      if (quantity > 0) {
        await Buy.create({ price, quantity }, { transaction });
      }
    }
    await transaction.commit();
    setTimeout(() => {
      console.log("Before Transaction sent response");
    }, 2000)
    res.send('Transaction recorded successfully');
  } catch (error) {
    await transaction.rollback();
    res.status(500).send('Error recording transaction');
  }
});

app.get('/getcompletedorder', (req, res) => {
  //Hear I need to send the Completed Order Table.
})

app.get('/pendingorder', async (req, res) => {
  //get the table Data here
  res.json(await getPendingOrders());
})

app.get('/completedorders', async (req, res) => {
  console.log("completedOrders");
  console.table(await getCompletedOrders());
  res.json(await getCompletedOrders());
})
*/
server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001/');
});