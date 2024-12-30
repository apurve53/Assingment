const { parentPort, workerData } = require('worker_threads');
const { spawn } = require('child_process');
const { getTime } = require('./t');

function processRecords(records) {
    let pythonProcessPromise = new Promise((resolve, reject) => {
        let answere = [];
        records['directChat'].map((item, index) => {
            item.chat.map((obj) => {
                obj.from ? null : obj.to ? answere.push(obj.chat) : null
            })
        })
        const pythonProcess = spawn('python', ['c:/Users/muni2/Downloads/Python/first.py']);
        pythonProcess.stdin.write(JSON.stringify(answere));
        pythonProcess.stdin.end();
        pythonProcess.stdout.on('data', (data) => {
            const similarities = JSON.parse(data.toString());
            console.log(`Similarity Matrix: ${getTime()}`, similarities);
            resolve(similarities);
        });
        pythonProcess.stderr.on('data', (error) => {
            console.error('*&*&Error from Python:', error.toString());
        });
        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
        });
    })
    return pythonProcessPromise;
}
processRecords(workerData).then((result) => {
    parentPort.postMessage(result);
});