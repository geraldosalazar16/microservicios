const ownership = require('../models/channel_device');
var Authorization = require('../../libs/Authorization');
const { sendMessages } = require('../../kafka');

// Bind a device to a channel
exports.bind = (req, res) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var dev_id = req.body.dev_id;

    // Authorization
    var authorized = Authorization.authorize("channel_devices/ownership/bind", { user_id, bid, chid, dev_id });
    if (authorized.status === 'success') {

        // Create a ownership 
        const ownershipSchema = new ownership({
            bid: bid,
            chid: chid,
            dev_id: dev_id,
        });

        ownershipMessage = {
            user_id: user_id,
            bid: bid,
            chid: chid,
            dev_id: dev_id,
            created_at: new Date(),
        }

        // Save ownership in the database
        ownershipSchema.save().then(data => {
            // Publish to kafka
            const kafkaMessage = JSON.stringify(Object.assign(ownershipMessage));
            sendMessages('channel_devices_device_bound', kafkaMessage);
            res.status(200).send({
                status: 'Success',
                message: 'Ownership has been created',
            });
        }).catch(err => {
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error ocurred while creating the ownership."
            });
        });
    } else {
        res.status(403).send('Not authorized');
    }
};

// Bind a group of devices to a channel
exports.bindAll = (req, res) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var dev_ids = req.body.dev_ids;
    var cont = 0;

    // Authorization
    var authorized = Authorization.authorize("channel_ devices/ownership/bind", { user_id, bid, chid, dev_ids });
    if (authorized.status === 'success') {

        for (var i = 0; i < dev_ids.length; i++) {
            cont = i + 1;

            // Create a ownership 
            const ownershipSchema = new ownership({
                bid: bid,
                chid: chid,
                dev_id: dev_ids[i],
            });

            // Save ownership in the database
            ownershipSchema.save().then(data => {
            }).catch(err => {
                res.status(500).send({
                    status: "Failed",
                    message: err.message || "Some error ocurred while creating some ownership."
                });
            });
        }
        if (cont == dev_ids.length) {

            ownershipMessage = {
                user_id: user_id,
                bid: bid,
                chid: chid,
                dev_ids: dev_ids,
                created_at: new Date(),
            }

            // Publish to kafka
            const kafkaMessage = JSON.stringify(Object.assign(ownershipMessage));
            sendMessages('channel_devices_device_bound', kafkaMessage);
            res.status(200).send({
                status: 'Success',
                message: 'All Ownership has been created',
            });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// Unbind a device from a channel
exports.unbind = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var dev_id = req.body.dev_id;

    // Authorization
    var authorized = Authorization.authorize('channel_devices/ownership/unbind', { user_id, bid, chid, dev_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !chid || !dev_id) {
            return res.status(400).send({
                message: "Ownership content bid, chid or dev_id can not be empty"
            });
        } else {
            ownership.deleteOne({ 'bid': bid, 'chid': chid, 'dev_id': dev_id }).then(data => {

                ownerMessage = {
                    user_id: user_id,
                    bid: bid,
                    chid: chid,
                    dev_id: dev_id,
                    created_at: new Date(),
                }

                const kafkaMessage = JSON.stringify(Object.assign(ownerMessage));
                sendMessages('channel_devices_device_unbound', kafkaMessage);
                res.status(200).send({
                    status: 'Success',
                    message: 'Ownership has been deleted'
                });
            }).catch(err => {
                res.status(500).send({
                    status: "Failed",
                    message: err.message || "Some error ocurred while deleted the ownership."
                });
            });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// Unbind a group of devices from a channel
exports.unbindAll = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var dev_ids = req.body.dev_ids;

    // Authorization
    var authorized = Authorization.authorize('channel_devices/ownership/unbind', { user_id, bid, chid, dev_ids });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !chid || dev_ids.length < 1) {
            return res.status(400).send({
                message: "Ownership content bid, chid or dev_id can not be empty"
            });
        } else {
            for (var i = 0; i < dev_ids.length; i++) {
                ownership.deleteOne({ 'bid': bid, 'chid': chid, 'dev_id': dev_ids[i] }).then(data => {
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while deleted the ownership."
                    });
                });
                cont = i + 1;
            }
            if (cont == dev_ids.length) {
                ownerMessage = {
                    user_id: user_id,
                    bid: bid,
                    chid: chid,
                    dev_ids: dev_ids,
                    created_at: new Date(),
                }

                const kafkaMessage = JSON.stringify(Object.assign(ownerMessage));
                sendMessages('channel_devices_device_unbound', kafkaMessage);
                res.status(200).send({
                    status: 'Success',
                    message: 'Ownership has been deleted'
                });
            }
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// Get bid and chid of a device
exports.get = (req, res) => {
    var user_id = req.body.user_id;
    var dev_id = req.body.dev_id;

    // Authorization
    var authorized = Authorization.authorize('channel_devices/ownership/get', { user_id, dev_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!dev_id) {
            return res.status(400).send({
                message: "Ownership content bid, chid or dev_id can not be empty"
            });
        } else {
            ownership.findOne({ 'dev_id': dev_id }).then(data => {
                res.status(200).send({
                    status: 'Success',
                    message: 'Device ' + dev_id,
                    data: data
                });
            }).catch(err => {
                res.status(500).send({
                    status: "Failed",
                    message: err.message || "Some error ocurred while get the ownership."
                });
            });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// List devices of a channel.
exports.list = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;

    // Authorization
    var authorized = Authorization.authorize('channel_devices/ownership/list', { user_id, bid, chid });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !chid) {
            return res.status(400).send({
                message: "Ownership content bid or chid can not be empty"
            });
        } else {
            ownership.find({ 'bid': bid}).then(data => {
                res.status(200).send({
                    status: 'Success',
                    message: 'Device list',
                    data: data
                });
            }).catch(err => {
                res.status(500).send({
                    status: "Failed",
                    message: err.message || "Some error ocurred while get the ownership."
                });
            });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};
