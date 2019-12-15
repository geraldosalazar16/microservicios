const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let rules = new Schema({
    clientId: {type: String},
    apiId: {type: String},
    conditions: [{
        title: {type: String},
        error: {type: String},
        type: {type: String},
        rule: {type: String},
        validator: {type: String},
        params: {type: String}
    }]
});

module.exports = mongoose.model('rules', rules);