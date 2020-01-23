const mongoose = require('mongoose');

const filterSchema = mongoose.Schema({
	filter_id: String, /*unique*/
		title: String,
		desc: String,
	override: String,  /*(“any”, “none” or “some”)*/
		rule: String
});

module.exports = mongoose.model('filter', filterSchema);