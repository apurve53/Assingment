const crypto = require('crypto');
const { exec } = require('child_process');

const hexString = crypto.randomBytes(32).toString('hex');

const buffer = Buffer.from(hexString, 'hex');
console.log(`String: ${hexString}`);
console.log(`Length in characters: ${hexString.length}`);
console.log(`Length in bytes: ${buffer.length}`);
// Command to set an environment variable for the user
// const command = `setx SEC_FOR_PORT_SERVER "${hexString}"`;

// // Execute the command
// exec(command, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.error(`stderr: ${stderr}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
// });