const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let group = new Schema({
    group_id: {type: String, unique: true},
    bid: {type: String},
    title: {type: String},
    desc: {type: String}
}, {
    versionKey: false
});

module.exports = mongoose.model('group', group);