const sale_channel = require('../models/sale_channel');
var Authorization = require('../../libs/Authorization');
var IdGenerator = require('../../libs/IdGenerator');
const { sendMessages } = require('../../kafka');

// Create and Save a new Channel
exports.create = (req, res) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var title = req.body.title;
    var desc = req.body.desc;
    var type = req.body.type;
    var sub_type = req.body.sub_type;
    var attribs = req.body.atrribs;

    // Authorization
    var authorized = Authorization.authorize('sale_channel/create', { user_id, bid });
    if (authorized.status === 'success') {
        var chid = IdGenerator.getNextId();

        // Create a Channel
        const channel = new sale_channel({
            bid: bid,
            title: title,
            desc: desc,
            type: type,
            sub_type: sub_type,
            attribs: attribs,
            chid: chid
        });

        channelMessage = {
            user_id: user_id,
            bid: bid,
            chid: chid,
            title: title,
            desc: desc,
            type: type,
            sub_type: sub_type,
            attribs: attribs,
            created_at: new Date(),
            created_by: user_id
        }

        // Save channel in th database
        channel.save().then(data => {
            // Publish to kafka
            const kafkaMessage = JSON.stringify(Object.assign(channelMessage));
            sendMessages('sale_channel_created', kafkaMessage);
            res.status(200).send({
                status: 'Success',
                message: 'Sale channel created',
                data: data
            });
        }).catch(err => {
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error ocurred while creating the Channel."
            });
        });
    } else {
        res.status(403).send('Not authorized');
    }
}

// Update a channel identified by the channel_info, bid and chid
exports.update = (req, res) => {
    // Authorization
    var authorized = Authorization.authorize('sale_channel/edit', { user_id: req.body.user_id, bid: req.body.bid, chid: req.body.chid });
    if (authorized.status === 'success') {
        // Validate request
        if (!req.body.bid || !req.body.chid) {
            return res.status(400).send({
                status: 'Failed',
                message: "Channel content bid and chid can not be empty"
            });
        } else {
            var channel_info = req.body.channel_info;
            const {
                bid,
                title,
                desc,
                type,
                sub_type,
                atrribs,
                chid
            } = channel_info;

            channelMessage = {
                user_id: req.body.user_id,
                chid: req.body.chid,
                channel_info: channel_info,
                bid: req.body.bid
            };

            sale_channel.findOne().
                where('bid').equals(req.body.bid).
                where('chid').equals(req.body.chid).then(data => {
                    data.bid = bid,
                        data.title = title,
                        data.desc = desc,
                        data.sub_type = type,
                        data.atrribs = atrribs,
                        data.chid = chid,
                        data.sub_type = sub_type
                    data.type = type
                    data.save();
                    const kafkaMessage = JSON.stringify(Object.assign(channelMessage, { created_at: new Date() }));
                    sendMessages('sale_channel_updated', kafkaMessage);
                    res.status(200).send({
                        status: 'Success',
                        message: "Sale chanel updated"
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while update the Channel."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
}

// Delete a channel 
exports.delete = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var chid = req.body.chid;
    // Authorization
    var authorized = Authorization.authorize('sale_channel/delete', { user_id, bid, chid });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !chid) {
            return res.status(400).send({
                status: "Failed",
                message: "Channel content bid and chid can not be empty"
            });
        } else {
            sale_channel.deleteOne().
                where('bid').equals(bid).
                where('chid').equals(chid).then(data => {

                    channelMessage = {
                        user_id: user_id,
                        chid: chid,
                        bid: bid
                    }

                    const kafkaMessage = JSON.stringify(Object.assign(channelMessage, { created_at: new Date() }));
                    sendMessages('sale_channel_deleted', kafkaMessage);
                    res.status(200).send({
                        status: 'Success',
                        message: 'Channel has been deleted'
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while deleted the Channel."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};



