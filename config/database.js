const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

require('dotenv').config()

let gfs;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        gfs = Grid(conn.connection.db, mongoose.mongo);
        gfs.collection('uploads');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = { connectDB, getGfs: () => gfs };
