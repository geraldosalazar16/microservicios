const mongoose = require('mongoose');
const department = require('../models/department.model');
const role = require('../models/role.model');
const Schema = mongoose.Schema;


/**
 *  bid: String, unique, main query key
-	created_at: Datetime
-	created_by: String
-	unique_name: String
-	unique_code: String, unique
-	name: String
-	description: String
-	departments: <List of Department documents>
-	roles: <List of Role documents>

 */
let business = new Schema({
    bid: { type: String, unique: true },
    user_id: { type: String, unique: true },
    created_at: { type: Date },
    created_by: { type: String, unique: true },
    unique_name: { type: String },
    unique_code: { type: String, unique: true },
    name: { type: String },
    description: { type: String },
    departments: { type: [] },
    roles: { type: [] }
});


module.exports = mongoose.model('business', business);