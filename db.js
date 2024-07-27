require('dotenv').config();
const {
  MONGO_PASS
} = process.env;
const bcrypt = require('bcrypt');

const { MongoClient } = require('mongodb');

// const uri = "mongodb://localhost:27017";
const mongo_password = encodeURIComponent(MONGO_PASS);
const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;
console.log("MONGO_PASS :", uri);

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to server");
    // Database and collection
    const database = client.db('chatdata');
    const collection = database.collection('user');
    const doc = { name: "Apurve", age: 32, address: "Wonderland" };
    const result = await collection.insertOne(doc);
    console.log(`New document created with the following id: ${result.insertedId}`);
    // Perform CRUD operations here
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir);
// run();
async function insertUser(user) {
  await client.connect();
  const database = client.db('chatdata');
  const collection = database.collection('user');
  let insertion = collection.insertOne(user);
  return insertion;
}

async function findUser(username, pass) {
  await client.connect();
  console.log("client connected", username);
  const database = client.db('chatdata');
  const collection = database.collection('user');
  const user = await collection.findOne({ "username": username });
  if (!user) {
    console.log(" user is not thre");
    return {
      'message': 'Error logging in', 'status': 401
    }
  }
  try {
    const match = await bcrypt.compare(pass, user.password)
    if (match) {
      // res.cookie('user', username, { httpOnly: false, secure: false });
      return {
        'message': 'Login successful', 'user': username, 'status': 200
      }
    } else {
      return { 'message': "Password not match", 'status': 401 }
    }
  } catch (error) {
    return { "message": 'Error logging in ' }
  }
}
async function checkUser(username) {
  await client.connect()
  let database = client.db('chatdata');
  let collection = database.collection('user')
  let user = await collection.findOne({ "username": username })
  if (user) {
    return true
  } else {
    return false;
  }
}

async function addUserChat(userchat) {
  try {
    console.log("user chat with user in addUser chat in db.js : ", userchat);
    await client.connect();
    let database = client.db('chatdata');
    let collection = database.collection('user');
    const result = await collection.updateOne(
      { username: userchat.user },
      { $set: { chat: userchat.chat } }
    );
    console.log("Result of Database update : ", result);
  } catch (errr) {
    console.log("error while database save chat");
  }
}
async function getUserChat(userobj) {
  // try {
  await client.connect();
  let database = client.db('chatdata');
  let coll = database.collection('user');
  let userData = await coll.findOne({ "username": userobj.user });
  console.log("checking Uer chat in db.js ", userData);
  return userData.chat;
  // } catch (err) {
  // console.log("this is Error in getting user chat : ", err);
  // }
}

async function handleResetChat(userObj) {
  await client.connect();
  let database = client.db('chatdata');
  let collection = database.collection('user');
  console.log("user IS : ", userObj)
  let userChatUpdate = await collection.updateOne({ username: userObj.user }, { $set: { chat: {} } });
  console.log("userChatUpdate", userChatUpdate);
  return userChatUpdate.matchedCount == 1 ? true : false;
}
// getUserChat({ 'user': 'srivastavaapurve66@gmail.com' });
module.exports = { insertUser, findUser, checkUser, addUserChat, getUserChat, handleResetChat };