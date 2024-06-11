const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const cors = require('cors');
const { PendingOrder, CompletedOrder, sequelize, DataTypes, Sell, Buy, getPendingOrders, getCompletedOrders } = require('./tables/index');
const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("client is :", req.url);
  console.log("client isss :", req.connection.remoteAddress);
  // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
})
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
app.post('/upload', upload.single('file'), async (req, res) => {
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
            await CompletedOrder.create({ price, quantity: buy.quantity }, { transaction });
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
      console.log("Adding Buy Request")
      console.table(allSell);
      console.table(req.body)
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
      setTimeout(() => {
        console.log("Before Transaction sent response");
        console.table(allSell);
        console.table(req.body);
      }, 2000)

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
  console.table(await getCompletedOrders());
  res.json(await getCompletedOrders());
})


app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001/');
});