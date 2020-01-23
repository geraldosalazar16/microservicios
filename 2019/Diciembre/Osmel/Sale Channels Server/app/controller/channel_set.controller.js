const channel_set = require('../models/channel_set');
var Authorization = require('../../libs/Authorization');
const { sendMessages } = require('../../kafka');


exports.assing = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var set_id = req.body.set_id;

    // Authorization
    var authorized = Authorization.authorize("sale_channel/sets/assign", { user_id, bid, chid, set_id });
    if (authorized.status === 'success') {

        // Create a Channel_set
        const channelSet = new channel_set({
            bid: bid,
            set_id: set_id,
            set_by: user_id,
            set_at: new Date(),
            chid: chid
        });

        channel_setMessage = {
            user_id: user_id,
            bid: bid,
            chid: chid,
            set_id: set_id,
            created_at: new Date()
        }

        // Save channel_set in th database
        channelSet.save().then(data => {
            // Publish to kafka
            const kafkaMessage = JSON.stringify(Object.assign(channel_setMessage));
            sendMessages('sale_channel_set_assigned', kafkaMessage);
            res.status(200).send({
                status: 'Success',
                message: 'Sale channel set assigned',
                data: data
            });
        }).catch(err => {
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error ocurred while creating the Channel_set."
            });
        });
    } else {
        res.status(403).send('Not authorized');
    }
}

// Revoke a channel_set
exports.revoke = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    var set_id = req.body.set_id;

    // Authorization
    var authorized = Authorization.authorize('sale_channel/sets/revoke', { user_id, bid, chid, set_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid) {
            return res.status(400).send({
                status: 'Failed',
                message: "Channel_set content bid can not be empty"
            });
        } else {
            channel_set.findOne().
                where('bid').equals(req.body.bid).then(data => {
                    data.chid = '';
                    data.set_id = '';
                    data.save();

                    channel_setMessage = {
                        user_id: user_id,
                        chid: chid,
                        bid: bid,
                        set_id: set_id
                    }

                    const kafkaMessage = JSON.stringify(Object.assign(channel_setMessage, { created_at: new Date() }));
                    sendMessages('sale_channel_set_revoked', kafkaMessage);
                    res.status(200).send({
                        status: 'Success',
                        message: 'Sale Channel set has been revoked'
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while revoke Channel set."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};


// Get set info of a channel.
exports.info = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;

    // Authorization
    var authorized = Authorization.authorize("sale_channel/sets/info", { user_id, bid, chid });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !chid) {
            return res.status(400).send({
                status: 'Failed',
                message: "Channel_set content bid and chid can not be empty"
            });
        } else {
        channel_set.findOne().
            where('bid').equals(bid).
            where('chid').equals(chid).then(data => {
                res.status(200).send({
                    status: 'Success',
                    message: 'Info of the channel set',
                    data: data
                });
            }).catch(err => {
                res.status(500).send({
                    status: "Failed",
                    message: err.message || "Some error ocurred while get Channel set."
                });
            });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

