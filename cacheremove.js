const { exec } = require('child_process');

// Define the command to run with environment variable
const command = `rmdir /s /q "%APPDATA%\\Code - Insiders\\Cache\\Cache_Data"`;

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