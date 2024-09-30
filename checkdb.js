require('dotenv').config();
const {
    MONGO_PASS
} = process.env;
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const mongo_password = encodeURIComponent(MONGO_PASS);
// const uri = "mongodb://localhost:27017";
const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;
// Create a new MongoClient
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const client = new MongoClient(uri);

async function chackAllUsers() {
    await client.connect();
    const database = client.db('chatdata');
    const collection = database.collection('user');
    const allusers = await collection.find({}).toArray();
    client.close();
    console.log("All Users/All Users count :", allusers);
    console.log("All Users/All Users count :", allusers.length);
}

chackAllUsers();
