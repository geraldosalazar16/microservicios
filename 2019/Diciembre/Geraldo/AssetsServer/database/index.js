const mongoose = require('mongoose');
const config = require('../config.json');

/**
 * Call this function to initialize database connection
 * We only have to call this once
 * All database operations willl be buffered till mongoose finish connecting
 */
module.exports = () => {
    mongoose.connect(config.mongodb.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;
}