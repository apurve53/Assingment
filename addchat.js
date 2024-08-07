require('dotenv').config();
const SampleChat = {
  "If you Buy any product": {
    "As It is": {
      "You can Sign Up directely to my orgnaisation. And In this Process process you have to read this page and and I am sure that you will get your API or downloads after reading my documentation here": {}
    },
    "Need Updated product": {}
  }
}
const {
  MONGO_PASS
} = process.env;
const { MongoClient } = require('mongodb');
const mongo_password = encodeURIComponent(MONGO_PASS);
const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function change(userObj) {
  await client.connect();
  let database = client.db('chatdata');
  let collection = database.collection('user');
  console.log("user IS : ", userObj)
  let userChatUpdate = await collection.updateOne({ username: userObj.user }, { $set: { chat: SampleChat } });
  console.log("userChatUpdate", userChatUpdate);
  client.close();
}
change({ 'user': 'srivastavaapurve66@gmail.com' });