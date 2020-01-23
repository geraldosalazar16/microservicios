const mongoose = require('mongoose');

const sale_channel = mongoose.Schema({
    bid: String,
	chid: String,
	type: String,
	sub_type: String,
	attribs: Array,
	title: String,
	desc: String
});

module.exports = mongoose.model('sale_channel', sale_channel);