const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    bid: String,
    dev_id: String,
    dev_serial: String,
    added_by: String,
    added_at: Date,
    temporary: Boolean,
    revoke: Boolean,
    title: String,
    desc: String
});

const deviceModel = mongoose.model('assets.devices', deviceSchema);

module.exports.createDevice = (device) => {
    const d = new deviceModel(device);
    return new Promise(resolve => {
        d.save((error, data) => {
            if (error) {
                resolve({
                    status: 'failed',
                    message: error.message
                });
            }
            resolve({
                status: 'success',
                message: 'Device saved'
            });
        });
    })
}

module.exports.findDevice = (device) => {
    const {dev_id, dev_serial, bid} = device;
    return new Promise(resolve => {
        deviceModel.findOne({dev_id, dev_serial, bid}, (err, doc) => {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            resolve({
                status: 'success',
                doc
            });
        });
    });
}

module.exports.revokeDevice = ({target_dev_id, bid}) => {
    return new Promise(resolve => {
        deviceModel.deleteOne({
            dev_id: target_dev_id,
            bid: bid
        }, (err, result) => {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            const message = result.deletedCount === 0 ? 'Device not found' : 'Device revoked';
            const status = result.deletedCount === 0 ? 'failed' : 'success'
            resolve({
                status,
                message
            });
        });
    });
}

module.exports.leaveDevice = ({dev_id, dev_serial, bid}) => {
    return new Promise(resolve => {
        deviceModel.deleteOne({
            dev_id,
            dev_serial,
            bid
        }, (err, result) => {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            const message = result.deletedCount === 0 ? 'Device not found' : 'Device revoked';
            const status = result.deletedCount === 0 ? 'failed' : 'success'
            resolve({
                status,
                message
            });
        });
    });
}

module.exports.listDevice = ({bid}) => {
    return new Promise(resolve => {
        deviceModel.find({
            bid
        }, (err, docs) => {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            resolve({
                status,
                docs
            });
        });
    });
}