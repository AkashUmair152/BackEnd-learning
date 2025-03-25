const mongoose = require('mongoose');
const config = require('config');

const debug = require('debug')('development:mongoose');


const connectDB = async () => {
    try {
        debug('Attempting to connect to MongoDB...');
        await mongoose.connect(`${config.get("MONGODB_URI")}/scatch`);
        debug('MongoDB connected successfully');
    } catch (err) {
        debug('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;