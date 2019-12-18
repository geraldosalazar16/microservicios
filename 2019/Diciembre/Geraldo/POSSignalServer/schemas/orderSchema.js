const mongoose = require('mongoose');
const product = require('./productSchema');

const schema = new mongoose.Schema({
    order_id: { type : String , unique : true, required : true, dropDups: true} ,
    bid: String,
    invoice_number: String,
    user_id: String,
    chid: String,
    dev_id: String,
    dev_serial: String,
    seller_name: String,
    seller_id: String,
    customer_id: String,
    customer_name: String,
    customer_address: String,
    customer_phone: String,
    total_tax_inc: Number,
    total_tax_exc: Number,
    tax: Number,
    tax_label: String,
    total_discount: Number,
    total_no_disc: Number,
    products: [product.productSchema],
    created_at: { type: Date, default: Date.now },
    invoice_type: {
        type: String,
        enum : ['normal','training', 'refund']
    }
});

const model = mongoose.model('order', schema);
exports.orderModel = model;

exports.createOrder = (order) => {
    const db = new model(order);
    return new Promise(resolve => {
        db.save((error, data) => {
            if (error) {
                resolve({
                    status: 'failed',
                    message: error.message
                });
            }
            resolve({
                status: 'success',
                message: 'Record created'
            });
        });
    })
}

exports.listOrders = ({bid}) => {
    return new Promise(resolve => {
        model.find({
            bid
        }, (err, docs) => {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            resolve({
                status: 'success',
                docs
            });
        });
    });
}

exports.listOrdersByChannel = ({bid, chid}) => {
    return new Promise(resolve => {
        model.find({
            bid,
            chid
        }, (err, docs) => {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            resolve({
                status: 'success',
                docs
            });
        });
    });
}