const { error } = require('console');
const { Worker } = require('worker_threads');
const path = require('path');
const { getTime } = require('./t');
const workerPath = path.resolve(__dirname, 'workerAiChat.js');
const checkSingleChatSimilerities = path.resolve(__dirname, 'forSingleChatSimilerities_worker.js');
async function processChatData(records) {
    return new Promise((resolve, reject) => {
        try {
            const worker = new Worker(workerPath, { workerData: records });
            worker.on('message', (result) => {
                console.log(`resultss in AI.js ${result}: on ${getTime()}`);
                resolve(result);
            });
            worker.on('error', (err) => {
                console.error('Workersss Error in AI.js:', err);
                reject({ 'status': 'fail' });
            });

            worker.on('exit', (code) => {
                if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
                // reject(new Error(`Worker exited with code ${code}`));
            });
        } catch (err) {
            console.error('Error in AI.js:', err);
            reject(err);
        } finally {
            // await client.close();
        }
    })
}

function checkSingleChatFromUsersChatData(records) {
    try {
        const worker = new Worker(checkSingleChatSimilerities, { workerData: records });
        worker.on('message', (result) => {
            return result;
        });
        worker.on('error', (err) => {
            console.error('Worker Error:', err);
            return { 'status': 'fail' }
        });

        worker.on('exit', (code) => {
            if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
        });

    } catch (err) {
        console.error('Error:', err);
    } finally {
        // await client.close();
    }
}
module.exports = { processChatData, checkSingleChatFromUsersChatData }