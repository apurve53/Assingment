const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
const {
    DB_NAME,
    DB_USER,
    DB_PASS,
    DB_HOST,
    DB_PORT
} = process.env;
try {
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
        host: DB_HOST,
        dialect: 'mysql',
        port: DB_PORT
    });
    async function authenticateDatabase() {
        try {
            await sequelize.authenticate();
            // console.table('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
    // Call the function to authenticate the connection
    authenticateDatabase();

    const Sell = sequelize.define('Sell', {
        price: DataTypes.FLOAT,
        quantity: DataTypes.INTEGER,
    });

    const Buy = sequelize.define('Buy', {
        price: DataTypes.FLOAT,
        quantity: DataTypes.INTEGER,
    });

    const CompletedOrder = sequelize.define('CompletedOrder', {
        price: { type: DataTypes.DECIMAL, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false }
    }, {});

    async function getPendingOrders() {
        const sellData = await Sell.findAll();
        const buyData = await Buy.findAll();
        const sellOrders = sellData.map(order => order.get({ plain: true }));
        const buyOrders = buyData.map(order => order.get({ plain: true }));
        console.table("buyOrders:", buyOrders);
        console.table("sellOrders:", sellOrders);

        const pendingOrders = { "sellData": sellOrders, "buyData": buyOrders };
        // console.table(pendingOrders);
        return pendingOrders;
    }

    async function getCompletedOrders() {
        const allCompletedOrders = await CompletedOrder.findAll();
        console.log("Completd Order Table");
        let allData = allCompletedOrders.map(order => order.get({ plain: true }));
        console.table(allData);
        return allData;
    }

    sequelize.sync();
    module.exports = { CompletedOrder, sequelize, Sell, Buy, getPendingOrders, getCompletedOrders };
} catch (e) {
    console.log("error : ", e);
}


