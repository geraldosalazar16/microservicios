const mongoose = require('mongoose');

const client = mongoose.Schema({
    clientId: String,       /*Unique*/
    clientSecret: String,   /*Hashed*/
    name: String,           /*Unique*/
    title: String,
    desc: String,
    active: Boolean       /*True by default*/
});

module.exports = mongoose.model('client', client);