require('dotenv').config();
const {
	MONGO_PASS
} = process.env;

const { MongoClient } = require('mongodb');
const mongo_password = encodeURIComponent(MONGO_PASS);
console.log(mongo_password)

const uri = `mongodb+srv://apurve2014:${mongo_password}@chatsuport.suprwbc.mongodb.net/?retryWrites=true&w=majority&appName=chatSuport`;
//const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// const client = new MongoClient(uri, { useUnifiedTopology: true });
const client = new MongoClient(uri);

async function finding() {
	await client.connect();
	const database = client.db('chatdata');
	const collection = database.collection('user');
	const user = await collection.find({ name: "a2" }).toArray();
	console.log(user)
	// await client.close();
}
// finding();

async function insertingChat() {
	await client.connect();
	const database = client.db('chatdata');
	const collection = database.collection('user');
	const user = await collection.insertMany({ name: "a2" }).toArray();
}


async function updateChatBigSize(createdChat) {
	await client.connect();
	const database = client.db('chatdata');
	const collection = database.collection('user');
	const user = await collection.updateOne({ name: "a2" }, { $set: { chat: createdChat } });
	console.log("is Updated : ", user);
	await client.close();
}
function numberToWords(number) {
	const singleDigits = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
	const doubleDigits = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
	const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
	const thousands = ["", "thousand"];

	let result = "";

	// Convert the number to a string and pad with zeros if necessary
	let numStr = number.toString();
	while (numStr.length < 5) {
		numStr = "0" + numStr;
	}

	// Thousands place
	let thousandPart = parseInt(numStr.slice(0, 2));
	if (thousandPart > 0) {
		if (thousandPart < 20) {
			if (thousandPart < 10) {
				result += singleDigits[thousandPart] + " " + thousands[1] + " ";
			} else {
				result += doubleDigits[thousandPart - 10] + " " + thousands[1] + " ";
			}
		} else {
			result += tens[parseInt(numStr[0])] + " " + singleDigits[parseInt(numStr[1])] + " " + thousands[1] + " ";
		}
	}

	// Hundreds place
	let hundredsDigit = parseInt(numStr[2]);
	if (hundredsDigit > 0) {
		result += singleDigits[hundredsDigit] + " hundred ";
	}

	// Tens and ones place
	let lastTwoDigits = parseInt(numStr.slice(3));
	if (lastTwoDigits > 0) {
		if (lastTwoDigits < 20) {
			if (lastTwoDigits < 10) {
				result += singleDigits[lastTwoDigits];
			} else {
				result += doubleDigits[lastTwoDigits - 10];
			}
		} else {
			result += tens[parseInt(numStr[3])] + " " + singleDigits[parseInt(numStr[4])];
		}
	}

	return result.trim();
}

// Example usage:
let number = 14;
// Outputs: "twelve thousand three hundred forty five"
function crteateChat() {
	let f = 12;
	let g = 43;
	let h = 56
	let chatObj = {}
	for (let index = 1; index < 10; index++) {
		f++;
		chatObj[`${numberToWords(index)}${f.toString()}`] = {}
		let babyObject = {};
		for (let i = 2; i < 6; i++) {
			g++
			babyObject[`${numberToWords(i)}${g.toString()}`] = {}
			let babyTobabyObj = {};
			for (let j = 12; j < 18; j++) {
				h++
				babyTobabyObj[`${numberToWords(j)}${h.toString()}`] = {};
			}
			babyObject[`${numberToWords(i)}${g.toString()}`] = babyTobabyObj;
		}
		chatObj[`${numberToWords(index)}${f.toString()}`] = babyObject;
	}
	console.log(Object.keys(chatObj));
	console.log(Object.keys(chatObj["one13"]));
	console.log(Object.keys(chatObj["one13"]["three45"]))
	return chatObj;
}
// console.log(crteateChat());
updateChatBigSize(crteateChat());
// console.log(Object.keys(crteateChat()["three"]["four"]["fourteen"]));