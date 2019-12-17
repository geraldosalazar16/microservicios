const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * permission
-	perm_id: String, unique, main query key
-	title: String
-	desc: String
 */
let permission = new Schema({
    perm_id: { type: String, unique: true },
    title: { type: String, unique: true },
    desc: { type: String },
});

module.exports = mongoose.model('permission', permission);