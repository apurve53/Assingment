const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";

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

async function insertUser(user) {
  await client.connect();
  const database = client.db('chatdata');
  const collection = database.collection('user');
  let insertion = collection.insertOne(user);
  return insertion;
}

async function findUser(username, password) {
  await client.connect();
  const database = client.db('chatdata');
  const collection = database.collection('user');
  let users = await collection.find({});
  const user = users.find(user => user.username == username);
  if (!user) {
    console.log(" user is not thre");
    return {
      'message': 'Error logging in', 'status': 401
    }
  }
  try {
    const match = await bcrypt.compare(password, user.password);
    console.log("is Matched : ", match);
    if (match) {
      req.session.user = { username };
      // res.cookie('user', username, { httpOnly: false, secure: false });
      console.log("tched : ", match);
      return {
        'message': 'Login successful', 'user': username, 'status': 200
      }
    } else {
      return { 'message': "Password not match", 'status': 401 }
    }
  } catch (error) {
    return { "message": 'Error logging in ' }
  }



  return user;
}

console.log("find user", findUser("apurve2014@gmail.com", 'asdfg'))
module.exports = { insertUser, findUser };