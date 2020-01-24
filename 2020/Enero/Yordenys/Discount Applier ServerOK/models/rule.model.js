const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let role = new Schema({
    bid: { type: String },
    chid: { type: String },
    variation: { type: {} },
    conditions: []
});

module.exports = mongoose.model('role', role);