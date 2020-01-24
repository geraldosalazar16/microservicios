const mongoose = require('mongoose');
const permission = require('../models/permission.model');
const Schema = mongoose.Schema;
/**
 *role
-	role_id: String, unique, main query key
-	name: String, unique
-	title: String
-	desc: String
-	created_at: Datetime
-	created_by: String
-	permissions: <List of Permission documents>

 */
let role = new Schema({
    role_id: { type: String, unique: true },
    name: { type: String, unique: true },
    title: { type: String },
    desc: { type: String },
    created_at: { type: Date },
    created_by: { type: String },
    permissions: { type: [] }
});

module.exports = mongoose.model('role', role);