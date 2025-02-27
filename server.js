import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import config from './src/config/config.js';
import connection from './src/database/connection.js';
import routes from './src/routes/index.js';

dotenv.config();

const app = express();
app.use(express.json({ limit: '100mb' }));

const mongoConnection = connection(mongoose, config, {
  autoIndex: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  keepAlive: 120,
  connectTimeoutMS: 1000
});


mongoConnection.connectToMongo();


routes(app, express);

app.get('/', (req, res) => {
  res.send('Home page');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

export default app;
