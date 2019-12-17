const business = require('../models/business.model');
const Authorization = require('../Authorization/Authorization');
const generateCode = require('../generateCode/generateCode');
const department = require('../models/department.model');
const kafkaSend = require('../kafka');

/**
 * This API creates a department and stores it in department table
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.create = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.query.user_id, bid: req.query.bid });
    if (authorization) {
        if (req.query.dep_name) {

            // Check dep_name should be at least 6 characters length

            if (req.query.dep_name.length < 4) {
                res.status(201).json({
                    status: "Failed",
                    message: "Error: dep_name should be at least 4 characters length"
                });
                throw "Error: dep_name should be at least 4 characters length";
            }

            // Check unique_name already exists
            var businessTemp = await business.find({ created_by: req.query.user_id, bid: req.query.bid })[0];
            var exists_dep_name = businessTemp.departments.
            find((depart) => {
                return depart.dep_name == req.query.dep_name;
            });

            if (exists_dep_name) {
                res.status(201).json({
                    status: "Failed",
                    message: "departments with same unique name already exists"
                });
                throw "departments with same unique name already exists";
            }

            const dep_id = generateCode.getNextId();
            businessTemp.departments.push(new department({
                dep_id,
                dep_name: req.query.dep_name,
                dep_title: req.query.dep_title,
                dep_desc: req.query.dep_desc,
                created_at: new Date(),
                created_by: req.query.user_id
            }));
            var query = { user_id: req.query.user_id, bid: req.query.bid };
            var valueUpdate = { $set: { departments: businessTemp.departments } };
            business.updateMany(query, valueUpdate, function(err, result) {
                if (err) {
                    console.log("update document error");
                    res.status(201).json({
                        status: "faild",
                        message: "Is update business faild"
                    });
                } else {
                    console.log("update document success");
                    // Publish event on Kafka
                    const kafkaMessage = JSON.stringify({
                        user_id: req.query.user_id,
                        dep_id,
                        dep_name: req.query.dep_name,
                        dep_title: req.query.dep_title,
                        dep_desc: req.query.dep_desc,
                        bid: req.query.bid,
                        created_at: new Date(),
                        created_by: req.query.user_id
                    });
                    kafkaSend('business_department_created', kafkaMessage);
                    res.status(200).json({
                        status: "success",
                        message: "Is update business successfull"
                    });
                }
            });
            // Publish event on Kafka
        } else {
            throw "dep_name is  undefine";
        }
    }
}

exports.edit = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.query.user_id, bid: req.query.bid });
    if (authorization) {
        var businessTemp = await business.find({ created_by: req.query.user_id, bid: req.query.bid })[0].
        departments.
        find((depart) => {
            if (depart.dep_id == req.query.dep_id) {
                depart.dep_name = req.query.name;
                depart.dep_desc = req.query.description;
            }
            return depart.dep_id == req.query.dep_id;
        });
        var query = { user_id: req.query.user_id, bid: req.query.bid };
        var valueUpdate = { $set: { departments: businessTemp.departments } };
        business.updateMany(query, valueUpdate, function(err, result) {
            if (err) {
                console.log("update document error");
                res.status(201).json({
                    status: "faild",
                    message: "Is update business faild"
                });
            } else {
                console.log("update document success");
                // Publish event on Kafka
                const kafkaMessage = JSON.stringify({
                    user_id: req.query.user_id,
                    dep_id: req.query.dep_id,
                    bid: req.query.bid,
                    name: req.query.name,
                    description: req.query.description
                });
                kafkaSend('business_department_updated', kafkaMessage);
                res.status(200).json({
                    status: "success",
                    message: "Is update business successfull"
                });
            }
        });
    }
}

exports.list = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.query.user_id, bid: req.query.bid });
    if (authorization) {
        departments = await business.find({ created_by: req.query.user_id, bid: req.query.bid })[0].departments;
        if (departments) {
            res.status(200).json({
                status: "success",
                message: "query successfull"
            });
        } else {
            res.status(201).json({
                status: "faild",
                message: "query faild"
            });
        }
        return departments;
    } else {
        res.status(201).json({
            status: "faild",
            message: "query faild"
        });
        throw "  access is not authorization";
    }
}

exports.delete = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.query.user_id, bid: req.query.bid });
    if (authorization) {
        var businessTemp = await business.find({ created_by: req.query.user_id, bid: req.query.bid })[0].
        departments.
        filter((depart) => {
            return depart.dep_id != req.query.dep_id;
        });
        var query = { user_id: req.query.user_id, bid: req.query.bid };
        var valueUpdate = { $set: { departments: businessTemp.departments } };
        business.updateMany(query, valueUpdate, function(err, result) {
            if (err) {
                res.status(201).json({
                    status: "faild",
                    message: "Is update business faild"
                });
            } else {
                // Publish event on Kafka
                const kafkaMessage = JSON.stringify({
                    user_id: req.query.user_id,
                    dep_id: req.query.dep_id,
                    bid: req.query.bid
                });
                kafkaSend('business_department_updated', kafkaMessage);
                res.status(200).json({
                    status: "success",
                    message: "Is update business successfull"
                });
            }
        });
    }
}