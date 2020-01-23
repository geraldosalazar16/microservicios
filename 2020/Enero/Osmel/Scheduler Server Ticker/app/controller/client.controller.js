const client = require('../models/client');
var config = require('../../config.json');
var crypto = require('crypto');
var randomId = require('../../libs/randomUUID');

// Create and Save a new client
exports.create = (req, res) => {

    var masterId = req.body.masterId;
    var masterSecret = req.body.masterSecret;
    var name = req.body.name;
    var desc = req.body.desc;
    var title = req.body.title;

    var hashedMasterSecret = crypto.createHash('sha512')
        .update(masterSecret)
        .digest('hex');

    // Authorization
    if (hashedMasterSecret == config.masterSecret && masterId == config.masterId) {

        // Genrate clientId and clientSecret with new Random UUID
        var clientId = randomId.UUID();
        var clientSecret = randomId.UUID();

        var hashedClientSecret = crypto.createHash('sha512')
            .update(clientSecret)
            .digest('hex');

        // Create a account
        const clientSchema = new client({
            clientId: clientId,
            clientSecret: hashedClientSecret,
            name: name,
            title: title,
            desc: desc,
            active: true
        });

        // Save client in the database
        clientSchema.save().then(data => {
            res.status(200).send({
                status: 'Success',
                message: 'Client created'
            });
        }).catch(err => {
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error ocurred while creating the Client."
            });
        });

    }
    else {
        res.status(403).send('Not authorized');
    }
}

// Delete an client 
exports.delete = (req, res) => {
    var masterId = req.body.masterId;
    var masterSecret = req.body.masterSecret;
    var term = '';
    if (!req.body.name) {
        var clientId = req.body.clientId;
        term = 'clientId';
    } else {
        var name = req.body.name;
        term = 'name';
    }

    var hashedMasterSecret = crypto.createHash('sha512')
        .update(masterSecret)
        .digest('hex');

    // Authorization
    if (hashedMasterSecret == config.masterSecret && masterId == config.masterId) {
        client.deleteOne().
            where(term).equals(clientId || name).then(data => {
                res.status(200).send({
                    status: 'Success',
                    message: 'Client has been deleted'
                });
            }).catch(err => {
                res.status(500).send({
                    status: "Failed",
                    message: err.message || "Some error ocurred while deleted the Client."
                });
            });

    } else {
        res.status(403).send('Not authorized');
    }
}

// Block an client 
exports.block = (req, res) => {
    var masterId = req.body.masterId;
    var masterSecret = req.body.masterSecret;
    var term = '';
    if (!req.body.name) {
        var clientId = req.body.clientId;
        term = 'clientId';
    } else {
        var name = req.body.name;
        term = 'name';
    }

    var hashedMasterSecret = crypto.createHash('sha512')
        .update(masterSecret)
        .digest('hex');

    // Authorization
    if (hashedMasterSecret == config.masterSecret && masterId == config.masterId) {
        client.findOne().
            where(term).equals(clientId || name).then(data => {
                data.active = false;
                data.save();
                res.status(200).send({
                    status: 'Success',
                    message: 'Client has been blcked'
                });
            }).catch(err => {
                res.status(500).send({
                    status: "Failed",
                    message: err.message || "Some error ocurred while blocked the Client."
                });
            });

    } else {
        res.status(403).send('Not authorized');
    }
}

// Unblock an client 
exports.unblock = (req, res) => {
    var masterId = req.body.masterId;
    var masterSecret = req.body.masterSecret;
    var term = '';
    if (!req.body.name) {
        var clientId = req.body.clientId;
        term = 'clientId';
    } else {
        var name = req.body.name;
        term = 'name';
    }

    var hashedMasterSecret = crypto.createHash('sha512')
        .update(masterSecret)
        .digest('hex');

    // Authorization
    if (hashedMasterSecret == config.masterSecret && masterId == config.masterId) {
        client.findOne().
            where(term).equals(clientId || name).then(data => {
                data.active = true;
                data.save();
                res.status(200).send({
                    status: 'Success',
                    message: 'Client has been unlocked'
                });
            }).catch(err => {
                res.status(500).send({
                    status: "Failed",
                    message: err.message || "Some error ocurred while unlocked the Client."
                });
            });

    } else {
        res.status(403).send('Not authorized');
    }
}

// List all clients 
exports.list = (req, res) => {
    var masterId = req.body.masterId;
    var masterSecret = req.body.masterSecret;

    var hashedMasterSecret = crypto.createHash('sha512')
        .update(masterSecret)
        .digest('hex');

    // Authorization
    if (hashedMasterSecret == config.masterSecret && masterId == config.masterId) {
        client.find().then(data => {
            var response = [];
            for (var i = 0; i < data.length; i++) {
                var record = data[i];
                data_json = {
                    name: record.name,
                    title: record.title,
                    desc: record.desc,
                    clientId: record.clientId,
                    active: record.active
                }
                response.push(data_json);
            }
            res.status(200).send({
                status: 'Success',
                message: 'List all Client',
                data: response
            });
        }).catch(err => {
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error ocurred while get list all Clients."
            });
        });

    } else {
        res.status(403).send('Not authorized');
    }
}


