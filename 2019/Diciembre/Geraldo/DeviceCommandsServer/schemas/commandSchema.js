const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    code: { type : String , unique : true, required : true, dropDups: true} ,
    type: String,
    purpose: String
});

const model = mongoose.model('command', schema);
exports.commandModel = model;

/**
 * List commands
 * @param {Object} data with type, purpose
 * If type & data === null Query all commands
 * If one of the properties is null and the other not, query based on that property
 * If type & data !== null Query commands by type and purpose
 * @returns List of commands
 */
exports.list = ({type, purpose}) => {
    const query = Object.assign({}, type, purpose);
    return new Promise(resolve => {
        model.find(query, (err, docs) => {
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