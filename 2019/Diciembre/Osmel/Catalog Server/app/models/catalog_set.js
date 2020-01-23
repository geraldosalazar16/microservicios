const mongoose = require('mongoose');

const catalog_setSchema = mongoose.Schema({
    	set_id: String, /*unique*/
    	bid: String, 
    	title: String,
    	desc: String,
    	filters: Object, /*Array of filter*/
    	args: Object    /*List of key, values*/
    
});

module.exports = mongoose.model('catalog_set', catalog_setSchema);