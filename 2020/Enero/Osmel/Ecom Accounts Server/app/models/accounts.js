const mongoose = require('mongoose');

const accounts = mongoose.Schema({
	account_id: String,   /*Unique*/
	type: String,
	sub_type: String,
	title: String,
	desc: String,
	credentials: String,
	lockstore_ref: String,
	request_id: String,
	bid: String,
});

module.exports = mongoose.model('accounts', accounts);