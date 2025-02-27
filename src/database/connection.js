import Grid from 'gridfs-stream';
import dotenv from 'dotenv';

dotenv.config();

let gfs;

export default function connection(mongoose, config, options) {
  function connectToMongo() {
    mongoose
      .connect(config.mongo.uri, options)
      .then(() => {
        console.info('MongoDB connected!');
        gfs = Grid(mongoose.connection.db, mongoose.mongo);
        gfs.collection('uploads');
      })
      .catch((err) => {
        console.error('MongoDB connection error, reconnecting..');
        setTimeout(connectToMongo, options.reconnectInterval); // Intenta reconectar
      });

    // mongoose.connection.on('reconnected', () => {
    //   console.info('MongoDB reconnected!');
    // });

    // mongoose.connection.on('error', (error) => {
    //   console.error(`Error in MongoDB connection: ${error.message}`);
    //   mongoose.disconnect();
    // });

    // mongoose.connection.on('disconnected', () => {
    //   console.error(
    //     `MongoDB disconnected! Reconnecting in ${options.reconnectInterval / 1000}s...`
    //   );
    //   setTimeout(connectToMongo, options.reconnectInterval);
    // });
  }

  return {
    connectToMongo,
    getGfs: () => {
      if (!gfs) {
        throw new Error('GFS not initialized. Please call connectToMongo first.');
      }
      return gfs;
    },
  };
}
