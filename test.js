// const express = require('express');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const path = require('path');

// const app = express();

// const PORT = 80;

// app.use(cookieParser());
// app.use(express.static('public'));
// app.use(express.json());
// app.use(session({
//   secret: 'yourSecretKey', // Secret key to sign the session ID cookie
//   resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
//   saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store
//   cookie: {
//     // maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
//     secure: false, // Set to true if using HTTPS
//     httpOnly: true // Prevents client-side JavaScript from accessing the cookie
//   }
// }));

// // console.log(new Date());
// // const expirationDate = new Date(Date.now() + 60000);
// // console.log(Date.now());
// // const expirationDate = Date.now() + 60000;
// // console.log(expirationDate);
// app.get('/', (req, res) => {
//   /*
//   //Note:- If we add numbers in Date.now() like Date.now() + 60000; it will give you a time by adding 1 minutes in current date and time;
//   //expire property is defining that the perticuler time to expire the cookies
//   const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
//    res.cookie('initialCookie', 'initialValue', { httpOnly: true, expires: expirationDate });

//   //using maxAge to set the expiration time in miliseconds.
//   // const maxAge = 5000; // 24 hours in milliseconds
//   // res.cookie('initialCookie', 'initialValue', { httpOnly: true, maxAge });
//   res.cookie('initialCookie', 'initialValue', { httpOnly: false });
// */
//   req.session.user = 'John Doe';
//   res.sendFile(path.join(__dirname, 'public', 'indeex.html'));
// });

// // Route to add a property to the cookies
// app.get('/add-property', (req, res) => {
//   res.cookie('newProperty', 'newValue', { httpOnly: false });
//   req.session.newProperty = 'newValue';
//   res.send('New property added to cookies');
// });

// // Route to check for the new property in cookies
// app.get('/check-property', (req, res) => {
//   if (req.cookies.newProperty) {
//     console.log('Cookies:', JSON.stringify(req.cookies));
//     res.end();
//   } else {
//     console.error('Error: newProperty not found in cookies');
//     res.status(400).send('Error: newProperty not found in cookies');
//   }
// });

// // Route to log all cookies
// app.get('/log-cookies', (req, res) => {
//   console.log('Session in log:', req.session);
//   // console.log('All Cookies:', req.cookies);
//   res.send('Check the server console for cookies');
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://192.168.1.10:${PORT}`);
// });


// const crypto = require('crypto');

// const algorithm = 'aes-256-ctr';
// const sec_for_crypto = '50b6d385329c24669289556e1075b8cd5531bab57d8a09a028390f6b89896f23'; // Must be 32 bytes for aes-256
// const iv = crypto.randomBytes(16);

// function encrypt(text) {
//   const cipher = crypto.createCipheriv(algorithm, Buffer.from(sec_for_crypto, 'hex'), iv);
//   const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

//   // return {
//   //   iv: iv.toString('hex'),
//   //   content: encrypted.toString('hex')
//   // };
//   return encrypted.toString('hex');
// }

// function decrypt(hash) {
//   const decipher = crypto.createDecipheriv(algorithm, Buffer.from(sec_for_crypto, 'hex'), Buffer.from(iv.toString('hex'), 'hex'));
//   const decrypted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
//   console.log("tis is butter", decrypted);
//   return decrypted.toString();
// }

// const userStatus = "John Doe";
// const stringData = JSON.stringify(userStatus);
// const encryptedData = encrypt(stringData);

// console.log("Encrypted Data:", encryptedData);

// const decryptedStringData = decrypt(encryptedData);
// const decryptedObject = JSON.parse(decryptedStringData);

// console.log("Decrypted Object:", decryptedObject);


// let cores = { name: null, age: 13 };
// let t = undefined;

// if (cores.name || t) {
//   console.log("working");
// } else {
//   console.log("Not working");
// }


// Trying trim() function this is the correct way to use trim function to remove blank spaces from start and end of the string.
// let newValue = "this   "
// newValue = newValue.trim();
// console.log(newValue.length);
// const d = new Date();
// console.log(d);
// const date = new Date();
// const formattedDate = new Intl.DateTimeFormat('en-US', {
//     formatMatcher: 'best fit',
//     dateStyle: 'short',
//     timeStyle: 'short',
//     timeZone: 'Asia/Kolkata'
// }).format(date);

// console.log(formattedDate);


// let data = {
//     "_id": {
//         "$oid": "66e81d7e68a30c73f1ca8cd7"
//     },
//     "name": "a2",
//     "username": "a2@gmail.com",
//     "password": "$2b$10$gSakKMCnJ9SlqTNKDAfmUuPC6uAxIEb4Aoig5qweGTOhS10OYJR6C",
//     "chat": {
//         "Related Services": {},
//         "Facing truble to useing Software": {},
//         "Query for new Project new one another edit": {
//             "you know your Project Type": {
//                 "Single Page WebSite that can show your busniss and some details": {
//                     "Website useing React and 3rd party css": {
//                         "Tailwind": {
//                             "IS you project will be developed from scrach?": {
//                                 "2": {},
//                                 "3": {},
//                                 "4": {},
//                                 "5": {},
//                                 "6": {},
//                                 "7": {},
//                                 "8": {},
//                                 "9": {},
//                                 "11": {},
//                                 "12": {},
//                                 "13": {},
//                                 "14": {},
//                                 "15": {},
//                                 "16": {},
//                                 "21": {},
//                                 "Is there any oter developer is working on same project?": {},
//                                 "1 adfadsghgaeaeh": {}
//                             }
//                         },
//                         "BoootStrap": {},
//                         "You Suggest": {}
//                     },
//                     "Website using 3d Animation and somthing else": {
//                         "Using 3d Models": {
//                             "Selef Created 3D Models": {
//                                 "Block Changing Design": {},
//                                 "A Design Which can rotate": {}
//                             }
//                         },
//                         "3rd Party created Models": {}
//                     }
//                 }
//             },
//             "Need Consletation about your Project": {
//                 "what is your Project About to": {
//                     "School Project": {},
//                     "Collage Project": {
//                         "your Project Needs Backend": {},
//                         "Your Project haveing Only Frontend": {},
//                         "You Need To Conselt About it": {
//                             "Contect Me on Mail": {
//                                 "apurve@gmail.com": {
//                                     "somthng new": {}
//                                 }
//                             },
//                             "Continue Chat for talk to conseltent": {}
//                         }
//                     }
//                 }
//             }
//         },
//         "New addition": {}
//     },
//     "Message": "We are unable to support you by here"
// }

// console.log(data.chat);

const { getOrigins } = require('./testIf');
async function letTest() {
    return "this is function";
}

getOrigins().then((val) => {
    console.log("value :", val);
})