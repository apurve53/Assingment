const crypto = require('crypto');
const { exec } = require('child_process');

const secret = crypto.randomBytes(64).toString('hex');

// Command to set an environment variable for the user
const command = `setx SEC_FOR_PORT_SERVER "${secret}"`;

// Execute the command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});