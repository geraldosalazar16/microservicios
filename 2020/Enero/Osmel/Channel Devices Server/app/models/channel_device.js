const mongoose = require('mongoose');

const ownership = mongoose.Schema({
	bid: String,
	chid: String,
	dev_id: String,

});

module.exports = mongoose.model('ownership', ownership);