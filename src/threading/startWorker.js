
import { Worker } from 'worker_threads';

const startWorker = (workerFile, payload) => {
    return new Promise((resolve, reject) => {

        const worker = new Worker(workerFile);

        worker.postMessage(payload);

        worker.on('message', (result) => {
            console.log('Worker message received:', result);
            if (result?.success) {
                console.log('Worker completed successfully.');
                resolve(result);
            } else {
                console.error('Error in worker:', result?.error || 'Unknown error');
                reject(new Error(result?.error || 'Unknown error'));
            }
        });

        worker.on('error', (error) => {
            console.error('Worker error:', error);
            reject(error);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });
    });
};

export default startWorker;
