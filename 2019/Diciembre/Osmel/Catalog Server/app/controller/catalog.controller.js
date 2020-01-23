const catalogSchema = require('../models/catalog');
var Authorization = require('../../libs/Authorization');
var IdGenerator = require('../../libs/IdGenerator');
var CodeGenerator = require('../../libs/CodeGenerator');
const { sendMessages } = require('../../kafka');

// Create and Save a new Catalog
exports.create = (req, res) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var dep_id = req.body.dep_id;
    var catalog_info = req.body.catalog_info;

    // Authorization
    var authorized = Authorization.authorize('/catalog/create', { user_id, bid, dep_id });
    if (authorized.status === 'success') {
        var pid = IdGenerator.getNextId();
        var unique_name = "hola123";
        gid = CodeGenerator.getNextCode(unique_name);

        // Create a catalog
        const catalog = new catalogSchema({
            gid: catalog_info.gid,
            bid: catalog_info.bid,
            dep_id: catalog_info.dep_id,
            pid: pid,
            title: catalog_info.title,
            desc: catalog_info.desc,
            barcode: catalog_info.barcode,
            image: catalog_info.image,
            production_date: catalog_info.production_date,
            expiry_date: catalog_info.expiry_date,
            created_at: catalog_info.created_at,
            created_by: catalog_info.created_by,
            category: catalog_info.category,
            tags: catalog_info.tags,
            tax_rule: catalog_info.tax_rule,
            manufacturer: catalog_info.manufacturer,
            supplier: catalog_info.supplier,
            active: catalog_info.active,
            on_sale: catalog_info.on_sale,
            width: catalog_info.width,
            height: catalog_info.height,
            depth: catalog_info.depth,
            weight: catalog_info.weight,
            measurement_unit: catalog_info.measurement_unit
        });

        catalogMessage = {
            user_id: user_id,
            unique_name: unique_name,
            bid: bid,
            pid: pid,
            gid: gid,
            dep_id: dep_id,
            catalog_info: catalog_info,
            created_by: 'yo'
        }

        // Save catalog in the database
        catalog.save().then(data => {
            // Publish to kafka
            const kafkaMessage = JSON.stringify(Object.assign(catalogMessage, { created_at: new Date() }));
            sendMessages('catalog_created', kafkaMessage);
            res.status(200).send({
                status: 'Success',
                message: 'Catalog created',
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

// Update a Catalog identified by the catalog_info, bid and chid
exports.update = (req, res) => {
    // Authorization
    var authorized = Authorization.authorize('catalog/edit', { user_id: req.body.user_id, bid: req.body.bid, pid: req.body.pid });
    if (authorized.status === 'success') {
        // Validate request
        if (!req.body.bid || !req.body.pid) {
            return res.status(400).send({
                status: "Failed",
                message: "Catalog content bid and pid can not be empty"
            });
        } else {
            var catalog_info = req.body.catalog_info;
           
            const {
                gid,
                bid,
                dep_id,
                pid,
                title,
                desc,
                barcode,
                image,
                production_date,
                expiry_date,
                created_at,
                created_by,
                category,
                tags,
                tax_rule,
                manufacturer,
                supplier,
                active,
                on_sale,
                width,
                height,
                depth,
                weight,
                measurement_unit,
            } = catalog_info;

            catalogMessage = {
                user_id: req.body.user_id,
                pid: req.body.pid,
                catalog_info: catalog_info,
                bid: req.body.bid
            };

            catalogSchema.findOne().
                where('bid').equals(req.body.bid).
                where('pid').equals(req.body.pid).then(data => {
                    data.gid = gid,
                        data.bid = bid,
                        data.dep_id = dep_id,
                        data.pid = pid,
                        data.title = title,
                        data.desc = desc,
                        data.barcode = barcode,
                        data.image = image,
                        data.production_date = production_date,
                        data.expiry_date = expiry_date,
                        data.created_at = created_at,
                        data.created_by = created_by,
                        data.category = category,
                        data.tags = tags,
                        data.tax_rule = tax_rule,
                        data.manufacturer = manufacturer,
                        data.supplier = supplier,
                        data.active = active,
                        data.on_sale = on_sale,
                        data.width = width,
                        data.height = height,
                        data.depth = depth,
                        data.weight = weight,
                        data.measurement_unit = measurement_unit,
                        data.save();
                    const kafkaMessage = JSON.stringify(Object.assign(catalogMessage, { created_at: new Date() }));
                    sendMessages('catalog_updated', kafkaMessage);
                    res.status(200).send({
                        status:'Success',
                        message: 'Catalog updated',
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

// Delete a Catalog 
exports.delete = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var pid = req.body.pid;

    // Authorization
    var authorized = Authorization.authorize('catalog/delete', { user_id, bid, pid });
    if (authorized.status === 'success') {
        // Validate request
        if (!pid) {
            return res.status(400).send({
                status: "Failed",
                message: "Catalog content pid can not be empty"
            });
        } else {
            catalogSchema.deleteOne().
                where('pid').equals(pid).then(data => {

                    catalogMessage = {
                        user_id: user_id,
                        pid: pid,
                        bid: bid
                    }

                    const kafkaMessage = JSON.stringify(Object.assign(catalogMessage));
                    sendMessages('catalog_deleted', kafkaMessage);
                    res.status(200).send({
                        status: 'Success',
                        message: 'Catalog has been deleted'
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while deleted the Catalog."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// List all catalogs 
exports.list = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;

    // Authorization
    var authorized = Authorization.authorize('/catalog/list', { user_id, bid });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid) {
            return res.status(400).send({
                status: "Failed",
                message: "Catalog content bid can not be empty"
            });
        } else {
            catalogSchema.find().
                where('bid').equals(bid).then(data => {
                    res.status(200).send({
                        status: 'Success',
                        message: 'List all catalogs for bid',
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get all catalogs."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// List all catalogs for category
exports.listByCategory = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var category = req.body.category;

    // Authorization
    var authorized = Authorization.authorize('/catalog/list/cat', { user_id, bid, category });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !category) {
            return res.status(400).send({
                status: "Failed",
                message: "Catalog content bid and category can not be empty"
            });
        } else {
            catalogSchema.find().
                where('bid').equals(bid).
                where('category').equals(category).then(data => {
                    res.status(200).send({
                        status: 'Success',
                        message: 'List all catalogs for category',
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get catalogs."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// List all catalogs for department
exports.listByDepartment = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var dep_id = req.body.dep_id;

    // Authorization
    var authorized = Authorization.authorize('/catalog/list/dep', { user_id, bid, dep_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !dep_id) {
            return res.status(400).send({
                status: "Failed",
                message: "Catalog content bid and dep_id can not be empty"
            });
        } else {
            catalogSchema.find().
                where('bid').equals(bid).
                where('dep_id').equals(dep_id).then(data => {
                    res.status(200).send({
                        status: 'Success',
                        message: 'List all catalogs for department',
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get catalogs."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// List all catalogs for tags
exports.listByTags = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var tags = req.body.tags;

    // Authorization
    var authorized = Authorization.authorize('/catalog/list/dep', { user_id, bid, tags });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !tags) {
            return res.status(400).send({
                status: "Failed",
                message: "Catalog content bid an tags can not be empty"
            });
        } else {
            catalogSchema.find().
                where('bid').equals(bid).
                where('tags').equals(tags).then(data => {
                    res.status(200).send({
                        status: 'Success',
                        message: 'List all catalogs for tags',
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get catalogs."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

