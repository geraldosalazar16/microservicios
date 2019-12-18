const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pid: String,
    gid: String,
    price_tax_inc: Number,
    price_tax_exc: Number,
    tax: Number,
    tax_lable: String,
    discount: Number,
    quantity: Number
});

exports.productSchema = productSchema;