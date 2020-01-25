const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let clock = new Schema({
    emp_id: {type: String},
    bid: {type: String},
    event: {type: String, enum: ["clock-in", "clock-out"]},
    at: {type: Date},
    day: {type: String}

}, {
    versionKey: false
});

module.exports = mongoose.model('clock', clock);