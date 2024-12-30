// let chatRef = {
//     "If you are already my client": {
//         "Is there any problem you are facing in project developed by me for you.": {},
//         "Was I a prat of a project.": {
//             "If it is my mistake, I will take care of that.": {
//                 "Please Contact me as soon as possible.": {}
//             },
//             "Anything wrong in live running project. ": {},
//             "If you are in service period?": {
//                 "Contact me for query Thanks for taking my services.": {}
//             },
//             "New updating will cost you accordingly if contract is over.": {}
//         },
//         "You need my help in you project.": {}
//     },
//     "You want hire me?": {
//         "You want me to develop something for you.": {
//             "Tell me something and get an idea of expenses.": {
//                 "Write Email with you contact details.": {},
//                 "On Phone Contact at 7340055790": {}
//             },
//             "Any Web Application": {
//                 "Is it a Simple Website": {
//                     "Website for Premotion your Business. ": {},
//                     "Business Card.": {
//                         "We can provide you some examples to choose and modify according to your test.": {
//                             "Just write down some of your information we will send you some card samples.": {}
//                         },
//                         "You tell me about you business we design.": {
//                             "It will cost you around $200.": {}
//                         }
//                     },
//                     "It will Cost you around 20k to 60k depends upon your selection of types of animation or productivity and simple task like query handling a dynamic simple website.": {}
//                 },
//                 "Deep server-based Application for run business according to load.": {
//                     "I can join the team is already working on a project as backend developer. ": {},
//                     "I can develop your Applicaiton from scratch and later you can add someone else for your security reasons or for fast work. After submitting your application Your Application we can provide some services for free like some miner updating or some more work on it. It doesn't affect live running application.": {},
//                     " Cloning a web application and modify it accordingly.": {}
//                 }
//             },
//             "Any Desktop Software": {},
//             "Any Web Software.": {}
//         },
//         "What can I do": {},
//         "Get My Resume": {},
//         "You want me to update a project": {
//             "One of your's": {
//                 "Contact with me on my Email or Phone": {
//                     "Phone : 7340055790": {},
//                     "Email : apurve2014@gmail.com": {}
//                 },
//                 "You can Email me about your instructions. Or write down here with your Email and Phone.": {}
//             },
//             "One of my": {
//                 "Write your query down here": {
//                     "You can Email me about your instructions. Or write down here with your Email and Phone.": {}
//                 },
//                 "How we can Connect?": {
//                     "My Contects": {
//                         "E:Mail : apurve2014@gmail.com\nPhone : 7340055790": {}
//                     },
//                     "Drop Your Contects": {
//                         "You can Write your valid email address and Phone Number": {}
//                     }
//                 }
//             }
//         }
//     }
// }
// let key = "Anything wrong in live running project. "
// let tempKeyList = [
//     {
//         selectedKey: "If you are already my client",
//         relatedKeys: [
//             "If you are already my client",
//             "You want hire me?",
//         ],
//     },
//     {
//         selectedKey: "Was I a prat of a project.",
//         relatedKeys: [
//             "Is there any problem you are facing in project developed by me for you.",
//             "Was I a prat of a project.",
//             "You need my help in you project.",
//         ],
//     },
//     {
//         selectedKey: "",
//         relatedKeys: [
//             "If it is my mistake, I will take care of that.",
//             "Anything wrong in live running project. ",
//             "If you are in service period?",
//             "New updating will cost you accordingly if contract is over.",
//         ],
//     },
// ]

// let level = tempKeyList.length;
// let newList = [];
// for (let i = 0; i < level; i++) {
//     if (tempKeyList[i]["relatedKeys"].includes(key)) {
//         console.log(`At i == ${i} and the Key to match is ${key} : Related Keys : ${tempKeyList[i]["relatedKeys"]}`);
//         tempKeyList[i]["selectedKey"] = key;
//         let indexFromRemove = i + 1;
//         tempKeyList = tempKeyList.slice(0, indexFromRemove);
//         tempChat = chatRef;
//         // console.log("chatRef in handle selection : ", chatRef.current);
//         for (let j = 0; j < tempKeyList.length; j++) {
//             tempChat = { ...tempChat[tempKeyList[j]["selectedKey"]] }
//         }
//         tempKeyList.push({ "selectedKey": "", "relatedKeys": Object.keys(tempChat) });
//     }
//     newList = tempKeyList;
// }
// console.log(newList);

let data = [{ "chat": [{ "from": "NfllIj7S3XShpUYvAAAF", "chat": "Hi" }, { "from": "NfllIj7S3XShpUYvAAAF", "chat": "I want to make a e-comers website to sell panting with different artist can sell the painting on that" }, { "to": "NfllIj7S3XShpUYvAAAF", "chat": "The sum of all costs required to complete a project, including hosting for 2 years and Project development costs is 5 lakhs " }] }, { "chat": [{ "from": "Db9jx2GYzc8i98YdAAAH", "chat": "Hello" }, { "to": "Db9jx2GYzc8i98YdAAAH", "chat": "How can i Help you." }, { "from": "Db9jx2GYzc8i98YdAAAH", "chat": "I want you to make a Ecommerce website for me" }, { "to": "Db9jx2GYzc8i98YdAAAH", "chat": "The sum of all costs required to complete a project, including hosting for 2 years and Project development costs is 5 lakhs" }, { "from": "Db9jx2GYzc8i98YdAAAH", "chat": "Okay how can we start. What details I have to give you." }, { "to": "Db9jx2GYzc8i98YdAAAH", "chat": "You can drop me an Email on srivastavaapurve66@gmail.com with timings of our first meeting." }, { "from": "Db9jx2GYzc8i98YdAAAH", "chat": "What kind of meeting?" }, { "to": "Db9jx2GYzc8i98YdAAAH", "chat": "It can be a video call meting or a chat conversation on Email or whatsapp for further communication" }, { "from": "Db9jx2GYzc8i98YdAAAH", "chat": "can i have your Email address" }, { "to": "Db9jx2GYzc8i98YdAAAH", "chat": "srivastavaapurve66@gmail.com" }] }, { "chat": [{ "from": "rz856vlJ6REhIKATAAAL", "chat": "I need a project for my college project" }] }, { "chat": [{ "from": "iFw9V8oAAIDLPj5NAAAR", "chat": "Hi yhis is late night of Kittu Birthday." }] }]

require('dotenv').config();
const {
    MONGO_PASS,
    ORIGENS_ID
} = process.env;
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
const mongo_password = encodeURIComponent(MONGO_PASS);
const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;
const client = new MongoClient(uri);
function getOrigins() {
    let database = client.db('chatdata');
    let collection = database.collection('user');
    return collection.find({}, { projection: { website: 1, _id: 0 } }).toArray().then((listOfWebsites) => {
        let originList = ["one"];
        for (let i = 0; i < listOfWebsites.length; i++) {
            originList.push(listOfWebsites[i].website);
        }
        return originList;
    }).catch((error) => {
        console.error("Error fetching origins:", error);
        throw error; // Re-throw the error for the caller to handle
    });
}



getOrigins();
module.exports = { getOrigins };
