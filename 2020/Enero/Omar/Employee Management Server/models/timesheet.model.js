const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;

var ShemaTypes = mongoose.Schema.Types;

let timesheet = new Schema({
    sheet_id: {type: String, unique: true},
    bid: {type: String, },
    group_id: {type: String},
    title: {type: String},
    desc: {type: String},
    daterange: [{
        date: {type: ShemaTypes.Long},
        from: {type: ShemaTypes.Long},
        to: {type: ShemaTypes.Long}
    }]
}, {
    versionKey: false
});

module.exports = mongoose.model('timesheet', timesheet);