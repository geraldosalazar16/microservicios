const channel_device = require('../models/channel_device');
var Authorization = require('../../libs/Authorization');
const { sendMessages } = require('../../kafka');

// Create and Save a new device
exports.create = (req, res) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var dev_id = req.body.dev_id;
    var dev_serial = req.body.dev_serial;
    var purpose = req.body.purpose;
    var title = req.body.title;
    var desc = req.body.desc;

    // Authorization
    var authorized = Authorization.authorize("sale_channel/device/add", { user_id, bid, chid, dev_id, dev_serial, purpose });
    if (authorized.status === 'success') {

        // Create a device
        const device = new channel_device({
            bid: bid,
            chid: chid,
            dev_id: dev_id,
            dev_serial: dev_serial,
            title: title,
            purpose: purpose,
            desc: desc,
            added_by: user_id,
            added_at: new Date()
        });

        deviceMessage = {
            user_id: user_id,
            bid: bid,
            chid: chid,
            dev_id: dev_id,
            dev_serial: dev_serial,
            title: title,
            purpose: purpose,
            desc: desc,
            created_at: new Date()
        }

        // Save device in the database
        device.save().then(data => {
            // Publish to kafka
            const kafkaMessage = JSON.stringify(Object.assign(deviceMessage));
            sendMessages('sale_channel_device_added', kafkaMessage);
            res.status(200).send({
                status: 'Success',
                message: 'Sale channel device added',
                data: data
            });
        }).catch(err => {
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error ocurred while added the Device."
            });
        });
    } else {
        res.status(403).send('Not authorized');
    }
}

// Delete a device 
exports.remove = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var dev_id = req.body.dev_id;
    var dev_serial = req.body.dev_serial;

    // Authorization
    var authorized = Authorization.authorize('sale_channel/device/remove', { user_id, bid, chid, dev_id, dev_serial });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !chid) {
            return res.status(400).send({
                status: 'Failed',
                message: "Device content bid and chid can not be empty"
            });
        } else {
            channel_device.deleteOne().
                where('bid').equals(bid).
                where('chid').equals(chid).then(data => {

                    deviceMessage = {
                        user_id: user_id,
                        chid: chid,
                        bid: bid,
                        dev_id: dev_id,
                        dev_serial: dev_serial,
                        created_at: new Date()
                    }

                    const kafkaMessage = JSON.stringify(Object.assign(deviceMessage));
                    sendMessages('sale_channel_device_removed', kafkaMessage);
                    res.status(200).send({
                        status: 'Success',
                        message: 'Device has been deleted'
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while deleted the Device."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// List devices of channel
exports.list = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var authorized = Authorization.authorize("sale_channel/device/list", { user_id, bid, chid });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !chid) {
            return res.status(400).send({
                status: 'Failed',
                message: "Device content bid and chid can not be empty"
            });
        } else {
            channel_device.find().
                where('bid').equals(bid).
                where('chid').equals(chid).then(data => {
                    res.status(200).send({
                        status: 'Success',
                        message: 'List device of channel',
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get list the Device."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
}

// Get information about device in the channel
exports.info = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var dev_id = req.body.dev_serial;
    var dev_serial = req.body.dev_serial;
    var authorized = Authorization.authorize("sale_channel/device/info", { user_id, bid, dev_id, dev_serial });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid) {
            return res.status(400).send({
                status: 'Failed',
                message: "Device content bid can not be empty"
            });
        } else {
            channel_device.find().
                where('bid').equals(bid).then(data => {
                    res.status(200).send({
                        status: 'Success',
                        message: 'Onformation about device',
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get information about the Device."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
}