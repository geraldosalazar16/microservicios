var mongoose = require('mongoose');
var config = require('../config.json');

var mongoDB = 'mongodb://127.0.0.1/samin';
mongoose.connect(mongoDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).catch((error) => console.log(error));
mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));