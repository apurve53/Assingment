const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const cors = require('cors');
// const { PendingOrder, CompletedOrder, sequelize, DataTypes, Sell, Buy, getPendingOrders, getCompletedOrders } = require('./tables/index');
const upload = multer({ dest: 'uploads/' });
const WebSocket = require('ws');
const http = require('http');

const app = express();
const users = [];
async function testuser() {
  const hashedPassword = await bcrypt.hash("asdfg", 10);
  users.push({ "name": "Apurve Srivastava", "username": "srivastavaapurve66@gmail.com", "password": hashedPassword });
}
testuser();
// app.use(
//   '/',
//   createProxyMiddleware({
//     target: 'http://localhost:3000',
//     changeOrigin: true,
//   })
// );
app.use(cookieParser());
app.use(session({
  secret: process.env.SEC_FOR_PROT_SERVER,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, expires: 600000 } // Set "secure" to true if using HTTPS
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  // if (req.url !== "/") {
  // console.log("client is :", req.url);
  // console.log("Ip:", req.ip);
  // console.log("Ip:", clientCount++);
  // console.log("Database call :", databaseCall);
  // }
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
  const user = users.find(user => user.username == username);
  if (!user) {
    console.log(" user is not thre");
    return res.status(401).send('Unauthorized');
  }
  try {
    const match = await bcrypt.compare(password, user.password);
    console.log("is Matched : ", match);
    if (match) {
      req.session.user = { username };
      // res.cookie('user', username, { httpOnly: false, secure: false });
      console.log("current sesstion : ", req.session);
      console.log("tched : ", match);
      res.json({ message: 'Login successful', user: { username } });
    } else {
      console.log("user incorect password");
      res.status(401).send('Unauthorized');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
})


app.post('/signup', async (req, res) => {
  const { name, username, password } = req.body;
  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    return res.status(400).send('User already exists');
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ name, username, "password": hashedPassword });
    res.redirect('http://localhost:3000/chatadmin');
  } catch (error) {
    res.status(500).send('Error registering user');
  }
})

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

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001/');
});