const { exec } = require('child_process');
const fs = require('fs');

// Function to execute the 'ps aux' command and get process info
const getProcessList = () => {
    return new Promise((resolve, reject) => {
        exec('ps aux', (error, stdout, stderr) => {
            if (error) {
                reject(`exec error: ${error}`);
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
};

// Function to monitor new process IDs after running a Node.js file
const monitorProcesses = async (nodeFile) => {
    let initialProcessList = await getProcessList();

    console.log('Initial process list captured.');

    // Execute the Node.js file
    const nodeProcess = exec(`node ${nodeFile}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }
        console.log(`Node.js file executed successfully: ${stdout}`);
    });

    // Monitor the process for new PIDs
    nodeProcess.stdout.on('data', async (data) => {
        console.log(`Output: ${data}`);

        // Wait for the process list to update (you can adjust this interval)
        setTimeout(async () => {
            let newProcessList = await getProcessList();

            // Compare the initial and new process list to detect new processes
            let newProcesses = compareProcessLists(initialProcessList, newProcessList);

            if (newProcesses.length > 0) {
                console.log('New processes detected:');
                newProcesses.forEach(process => {
                    console.log(`PID: ${process.pid}, Command: ${process.command}, User: ${process.user}`);
                });
            }

            initialProcessList = newProcessList; // Update the initial list for the next comparison
        }, 2000); // 2 seconds interval to check for new processes (you can adjust this)
    });
};

// Function to compare two process lists and return new processes
const compareProcessLists = (initialList, newList) => {
    const initialProcesses = parseProcessList(initialList);
    const newProcesses = parseProcessList(newList);

    const newPIDs = newProcesses.filter(proc => !initialProcesses.some(initial => initial.pid === proc.pid));
    return newPIDs;
};

// Function to parse the process list output into a structured format
const parseProcessList = (processList) => {
    const lines = processList.split('\n');
    const processes = [];

    lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 11) {
            processes.push({
                pid: parts[1],
                user: parts[0],
                command: parts.slice(10).join(' '),
            });
        }
    });

    return processes;
};

// Start monitoring after providing the Node.js file name
const nodeFile = 'server.js'; // Replace with your Node.js file name
monitorProcesses(nodeFile);
