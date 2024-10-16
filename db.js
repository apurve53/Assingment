const { encrypt } = require('./EncriptDecript');
require('dotenv').config();
const {
  MONGO_PASS,
  ORIGENS_ID
} = process.env;
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
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
  let insertion = await collection.insertOne(user);
  let dataCollection = database.collection('data');
  const id = new ObjectId(ORIGENS_ID);
  if (insertion.acknowledged) {
    await collection.updateOne(
      { _id: id },
      { $push: { origins: user["website"] } }
    );
    return insertion.acknowledged
  } else {
    return insertion.acknowledged;
  }
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
  await client.connect();
  let database = client.db('chatdata');
  let collection = database.collection('user')
  // let user = await collection.findOne({ "username": username })
  let user = await collection.findOne({ "username": username });
  console.log("username : ", username + " :: " + user);
  if (user !== null) {
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
  await client.connect();
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
  try {
    await client.connect();
    let database = client.db('chatdata');
    let collection = database.collection('user');
    await collection.updateOne({ username: obj.user }, { $set: { Message: obj["Message"] } })
  } catch (e) {
    console.log("Error while Setting Message to User", e);
  }
}

// SEprate Section for testing perpouse. down there
async function saveIV(iv) {
  await client.connect;
  let database = client.db('chatdata');
  let collection = database.collection('data');
  let isIV = await collection.updateOne({ "type": "crytorandomebyte" }, { $set: { "iv": iv } });
  if (isIV.acknowledged) {
    return true;
  } else {
    console.log("isIV :", isIV);
  }
  console.log("isIV :", isIV);
}

async function getIV() {
  await client.connect;
  let database = client.db('chatdata');
  let collection = database.collection('data');
  const result = await collection.findOne(
    { "type": "crytorandomebyte" }, // Query to match the type
    { "iv": 1, _id: 0 } // Projection to return only the iv field and exclude _id
  );
  // console.log("result :", result);
  return result;
}
async function getSampleChat() {
  // try {
  await client.connect();
  let database = client.db('chatdata');
  let collection = database.collection('data');
  let sampleChat = await collection.findOne({})
  console.log("Sample Chat : ", sampleChat)
  return await sampleChat['samplechat'];
  // } catch (err) {
  //   console.log("error is", err);
  // }
}

async function updatePasswordForTestUser() {
  try {
    await client.connect();
    let database = client.db('chatdata');
    let collection = database.collection('user');

    let isUpdate = await collection.updateOne({ username: "a2@gmail.com" }, { $set: { password: encrypt("asdfg") } })
    console.log("Password is updated :", isUpdate);
    // client.close();
  } catch (e) {
    console.log("Error while Setting Message to User", e);
  }
}
// console.log(getSampleChat());
// updatePasswordForTestUser();
// console.log(getSampleChat());

module.exports = { getIV, saveIV, sendMessageToUser, insertUser, findUser, checkUser, addUserChat, getUserChat, handleResetChat, getSampleChat };