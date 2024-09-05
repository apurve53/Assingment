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
async function insertUser(user) {
  await client.connect();
  const database = client.db('chatdata');
  const collection = database.collection('user');
  let insertion = collection.insertOne(user);
  return insertion;
}

async function findUser(username, pass) {
  await client.connect();
  const database = client.db('chatdata');
  const collection = database.collection('user');
  const user = await collection.findOne({ "username": username });
  if (!user) {
    return {
      'message': 'Error logging in', 'status': 401
    }
  }
  try {
    const match = await bcrypt.compare(pass, user.password)
    if (match) {
      // res.cookie('user', username, { httpOnly: false, secure: false });
      return {
        'user': username
      }
    } else {
      return {
        'message': "Password not match", 'status': 401
      }
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
    await client.connect();
    let database = client.db('chatdata');
    let collection = database.collection('user');
    const result = await collection.updateOne(
      { username: userchat.user },
      { $set: { chat: userchat.chat } }
    );
    return result;
  } catch (errr) {
    return {};
  }
}
async function getUserChat(userobj) {
  try {
    await client.connect();
  } catch (e) {
    console.log("Error getting connection : ", e);
  }
  let database = client.db('chatdata');
  let coll = database.collection('user');
  try {
    let userData = await coll.findOne({ "username": userobj.user });
    return userData.chat;
  } catch (e) {
    console.log("Error sending user Chat : ", e);
  }
}

async function handleResetChat(userObj) {
  await client.connect();
  let database = client.db('chatdata');
  let collection = database.collection('user');
  let userChatUpdate = await collection.updateOne({ username: userObj.user }, { $set: { chat: {} } });
  return userChatUpdate.matchedCount == 1 ? true : false;
}
async function sendMessageToUser(obj) {
  console.log("in db.js", obj)
  try {
    await client.connect();
    let database = client.db('chatdata');
    let collection = database.collection('user');
    await collection.updateOne({ username: obj.user }, { $set: { Message: obj["Message"] } })
  } catch (e) {
    console.log("Error while Setting Message to User", e);
  }
}

async function getSampleChat() {
  // try {
  await client.connect();
  let database = client.db('chatdata');
  let collection = database.collection('data');
  let sampleChat = await collection.findOne({})
  console.log("Sample Chat : ", sampleChat)
  return sampleChat['samplechat'];
  // } catch (err) {
  //   console.log("error is", err);
  // }
}
// console.log(getSampleChat());

module.exports = { sendMessageToUser, insertUser, findUser, checkUser, addUserChat, getUserChat, handleResetChat, getSampleChat };