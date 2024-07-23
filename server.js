const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
// const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');


const cors = require('cors');
// const { PendingOrder, CompletedOrder, sequelize, DataTypes, Sell, Buy, getPendingOrders, getCompletedOrders } = require('./tables/index');
const upload = multer({ dest: 'uploads/' });
const WebSocket = require('ws');
const http = require('http');
const { insertUser, addUserChat, findUser, getUserChat } = require('./db');
const { checkPrime } = require('crypto');

const app = express();
const users = [];

// app.use(
//   '/',
//   createProxyMiddleware({
//     target: 'http://localhost:3000',
//     changeOrigin: true,
//   })
// );
const store = new session.MemoryStore();
app.use(session({
  secret: process.env.SEC_FOR_PROT_SERVER,
  // name: 'sessionId',
  // resave: false,
  cookie: { maxAge: 600000 }, // Set "secure" to true if using HTTPS
  saveUninitialized: false,
  store
}));
app.use(express.urlencoded({ extended: false }));
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true // Enable cookies and other credentials in requests
};
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Store :", store);
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
  console.log("ipAddress is :", ip);
  connectedUsers.push({ userIP: ip, userChatData: [] });
  console.log('New client connected');
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
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

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
app.get('/', (req, res) => {
  console.log("simple Request");
  res.redirect('http://localhost:3000');
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userStatus = await findUser(username, password)
  //find user in mongodb
  console.log("userStatus while loging in ", userStatus);
  if (!userStatus.user) {
    console.log(" user is not thre");
    res.status(402);
  } else {
    req.session.autnticated = true;
    req.session.user = { username };
    // console.log(`just after saving session again in login :`, JSON.stringify(req.session));
    res.status(200).json(userStatus);
  }
})

app.post('/signup', async (req, res) => {
  const { name, username, password } = req.body;
  const existingUser = users.find(user => user.username === username);
  if (await checkUser(username)) {
    return res.status(400).send('User already exists');
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ name, username, "password": hashedPassword });
    let insertion = insertUser({ name, username, 'password': hashedPassword, 'chat': {} })
    console.log("after Inserting the User:", insertion);
    if (insertion) {
      res.redirect('http://localhost:3000/chatadmin');
    } else {
      res.status(500).send("User is not established");
    }
  } catch (error) {
    res.status(500).send('Error registering user');
  }
})

app.post('/userchat', async (req, res) => {
  let userchat = await getUserChat(req.body);
  // console.log(userchat);
  res.status(200).json(userchat);
})

app.post('/clientchatadd', (req, res) => {
  console.log(`session user should be display I am doing it login :${JSON.stringify(req.session)}`);
  if (req.body.user) {
    let userchat = req.body.chat;
    addUserChat({ "user": req.body.user, 'chat': userchat })
    res.status(200).json({ 'user': req.session.user });
  } else {
    res.status(401).json({ 'message': "Unauthorized" })
  }
})

app.post('/testnode', (req, res) => {
  console.log("chat to add in db", req.url);
  console.log("chat to add in db", req.method);
  res.send("yess working");
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
      console.log("Adding Sell Request")
      console.table(allBuy);
      console.table(req.body)
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