const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let membership = new Schema({
    bid: {type: String},
    user_id: {type: String},
    emp_id: {type: String, unique: true},
    department: {type: String},
    role: {type: String},
    permissions: [{type: String}],
    added_by: {type: String},
    added_at: {type: Date},
    temporary: {type: Boolean},
    revoked: {type: Boolean},
    revoked_by: {type: Boolean},
    revoked_at: {type: Date},
    expire_at: {type: Date},
    title: {type: String}
});

module.exports = mongoose.model('membership', membership);