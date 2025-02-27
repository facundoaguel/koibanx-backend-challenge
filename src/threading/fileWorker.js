import { parentPort } from 'worker_threads';

import fileControllerInstance from '../adapters/instances/fileControllerInstance.js';
import mongoose from 'mongoose';
import config from '../config/config.js';
import connection from '../database/connection.js';


parentPort.on('message', async ({ fileId }) => {
    connection(mongoose, config, {
        autoIndex: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 10000,
        keepAlive: 120,
        connectTimeoutMS: 1000
      }).connectToMongo();
    
    await fileControllerInstance.process(fileId);
    
    parentPort.postMessage({success: true});
});