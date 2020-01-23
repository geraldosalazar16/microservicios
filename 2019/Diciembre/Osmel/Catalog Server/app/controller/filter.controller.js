const filter = require('../models/filter');
var Authorization = require('../../libs/Authorization');
var IdGenerator = require('../../libs/IdGenerator');
const { sendMessages } = require('../../kafka');

// Create and Save a new Filter
exports.create = (req, res) => {

    var user_id = req.body.user_id;
    var title = req.body.title;
    var desc = req.body.desc;
    var override = req.body.override;
    var rule = req.body.rule;

    // Authorization
    var authorized = Authorization.authorize("/catalog/filter/create", { user_id });
    if (authorized.status === 'success') {
        var filter_id = IdGenerator.getNextId();

        // Create a filter
        const filterSchema = new filter({
            filter_id: filter_id,
            title: title,
            desc: desc,
            override: override,
            rule: rule
        });

        filterMessage = {
            filter_id: filter_id,
            title: title,
            desc: desc,
            override: override,
            rule: rule,
            created_at: new Date(),
            created_by: "Yo"
        }

        // Save filter in the database
        filterSchema.save().then(data => {
            // Publish to kafka
            const kafkaMessage = JSON.stringify(Object.assign(filterMessage));
            sendMessages('catalog_filter_created', kafkaMessage);
            res.status(200).send({
                status: 'Success',
                message: 'Catalog filter created',
                data: data
            });
        }).catch(err => {
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error ocurred while creating the filter."
            });
        });
    } else {
        res.status(403).send('Not authorized');
    }
};

// Delete a filter
exports.delete = (req, res) => {
    var user_id = req.body.user_id;
    var filter_id = req.body.filter_id;

    // Authorization
    var authorized = Authorization.authorize('/catalog/filter/delete', { user_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!filter_id) {
            return res.status(400).send({
                message: "Filter content filter_id can not be empty"
            });
        } else {
            filter.deleteOne().
                where('filter_id').equals(filter_id).then(data => {

                    filterMessage = {
                        filter_id: filter_id,
                        created_at: new Date(),
                        created_by: "yo"
                    }

                    const kafkaMessage = JSON.stringify(Object.assign(filterMessage));
                    sendMessages('catalog_filter_deleted', kafkaMessage);
                    res.status(200).send({
                        status: 'Success',
                        message: 'Filter has been deleted'
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while deleted the filter."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// List all filters
exports.list = (req, res) => {
    var filter_id = req.body.filter_id;

    // Authorization
    var authorized = Authorization.authorize('/catalog/filter/list', { filter_id });
    if (authorized.status === 'success') {
            filter.find().then(data => {
                    res.status(200).send({
                        status: 'Success',
                        message: 'List all filters',
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get filters."
                    });
                });
    } else {
        res.status(403).send('Not authorized');
    }
};
