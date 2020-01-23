const mongoose = require('mongoose');

const schedule = mongoose.Schema({
	request_code: String, /* Unique */
	datetime: Date,
	endpoints: Array,
	done: Boolean ,
	queed: Boolean ,
	task: Object 
});

module.exports = mongoose.model('schedule', schedule);