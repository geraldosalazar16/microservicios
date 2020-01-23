const mongoose = require('mongoose');

const channel_set = mongoose.Schema({
    bid: String,
    chid: String,
    set_id: String,
    set_by: String,
    set_at: Date

});

module.exports = mongoose.model('channel_set', channel_set);