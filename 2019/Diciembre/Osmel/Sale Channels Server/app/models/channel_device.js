const mongoose = require('mongoose');

const channel_device = mongoose.Schema({
    bid: String,
    chid: String,
    dev_id: String,
    dev_serial: String,
    title: String,
    desc: String,
    purpose: String,
    added_by: String,
    added_at: Date

});

module.exports = mongoose.model('channel_device', channel_device);