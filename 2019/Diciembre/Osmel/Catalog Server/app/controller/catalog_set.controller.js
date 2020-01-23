const catalog_set = require('../models/catalog_set');
var Authorization = require('../../libs/Authorization');
var IdGenerator = require('../../libs/IdGenerator');
const { sendMessages } = require('../../kafka');

// Creates a new Catalog set
exports.create = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var title = req.body.title;
    var desc = req.body.desc;
    var filter = req.body.filter;
    var args = req.body.args;

    // Authorization
    var authorized = Authorization.authorize("/catalog/set/create", { user_id, bid });
    if (authorized.status === 'success') {
        set_id = IdGenerator.getNextId();

        // Create a catalog_set
        const catalogSet = new catalog_set({
            set_id: set_id,
            bid: bid,
            title: title,
            desc: desc,
            filters: filter,
            args: args
        });

        catalog_setMessage = {
            set_id: set_id,
            title: title,
            desc: desc,
            bid: bid,
            filters: filter,
            args: args,
            created_at: new Date(),
            created_by: 'yo'
        }

        // Save channel_set in th database
        catalogSet.save().then(data => {
            // Publish to kafka
            const kafkaMessage = JSON.stringify(Object.assign(catalog_setMessage));
            sendMessages('catalog_set_created', kafkaMessage);
            res.status(200).send({
                status: 'Success',
                message: 'Catalog_set created'
            });
        }).catch(err => {
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error ocurred while creating the catalog set."
            });
        });
    } else {
        res.status(403).send('Not authorized');
    }
};

// Delete a Catalog set 
exports.delete = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var set_id = req.body.set_id;

    // Authorization
    var authorized = Authorization.authorize('/catalog/set/delete', { user_id, bid, set_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !set_id) {
            return res.status(400).send({
                message: "Catalog content bid and set_id can not be empty"
            });
        } else {
            catalog_set.deleteOne().
                where('bid').equals(bid).
                where('set_id').equals(set_id).then(data => {

                    catalog_setMessage = {
                        set_id: set_id,
                        bid: bid,
                        created_at: new Date(),
                        created_by: "yo"
                    }

                    const kafkaMessage = JSON.stringify(Object.assign(catalog_setMessage));
                    sendMessages('catalog_set_deleted', kafkaMessage);
                    res.status(200).send({
                        status: 'Success',
                        message: 'Catalog set has been deleted'
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while deleted the catalog set."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// Info of a catalog set for bid and set_id 
exports.info = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var set_id = req.body.set_id;

    // Authorization
    var authorized = Authorization.authorize('/catalog/set/info', { user_id, bid, set_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !set_id) {
            return res.status(400).send({
                status: "Failed",
                message: "Catalog content bid and set_id can not be empty"
            });
        } else {
            catalog_set.find().
                where('bid').equals(bid).
                where('set_id').equals(set_id).then(data => {
                    res.status(200).send({
                        status: 'Success',
                        message: 'Info catalog set',
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get the catalog set."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// List all sets of this business 
exports.list = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;

    // Authorization
    var authorized = Authorization.authorize('/catalog/set/info', { user_id, bid });
    if (authorized.status === 'success') {
        if (!bid) {
            return res.status(400).send({
                status: "Failed",
                message: "Catalog content bid can not be empty"
            });
        } else {
            catalog_set.find().
                where('bid').equals(bid).then(data => {
                    res.status(200).send({
                        status: 'Success',
                        message: 'List all catalogs set for bid',
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get catalogs set."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

