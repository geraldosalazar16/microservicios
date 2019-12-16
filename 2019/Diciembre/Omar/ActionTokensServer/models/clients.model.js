const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let clients = new Schema({
    clientId: { type: String, unique: true },
    clientSecret: { type: String },
    name: { type: String, unique: true },
    title: { type: String },
    desc: { type: String },
    active: { type: Boolean, default: true }
});

module.exports = mongoose.model('clients', clients);