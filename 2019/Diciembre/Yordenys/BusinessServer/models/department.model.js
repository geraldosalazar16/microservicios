const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * department
-	dep_id: String, unique, main query key
-	dep_name: String, unique
-	dep_title: String
-	dep_desc: String
-	created_at: Datetime
-	created_by: String
 */
let department = new Schema({
    dep_id: { type: String, unique: true },
    dep_name: { type: String, unique: true },
    dep_title: { type: String },
    dep_title: { type: String },
    dep_desc: { type: String },
    created_at: { type: Date },
    created_by: { type: String }
});

module.exports = mongoose.model('department', department);