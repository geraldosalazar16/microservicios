const mongoose = require('mongoose');

const catalogSchema = mongoose.Schema({
    gid: String,    /*unique*/
    bid: String,
    dep_id: String,
    pid: String,    /*Unique, main query key*/
    title: String,
    desc: String,
    barcode: String,
    image: Array,   /*List of strings*/
    production_date: Date,
    expiry_date: Date,
    created_at: Date,
    created_by: String,
    category: String,
    tags: Array,    /*String array*/
    tax_rule: String,
    manufacturer: String,
    supplier: String,
    active: Boolean,
    on_sale: Boolean,
    width: Number,
    height: Number,
    depth: Number,
    weight: Number,
    measurement_unit: String

});

module.exports = mongoose.model('catalog', catalogSchema);