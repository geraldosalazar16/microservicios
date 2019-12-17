const business = require('../models/business.model');
const Authorization = require('../Authorization/Authorization');
const generateCode = require('../generateCode/generateCode');

function ExistsCodeGenerate() {
    var Count_Code = 0;
    var code = "";
    do {
        code = generateCode.getNextId();
        Count_Code = business.find({ bid: code }).count();
    } while (Count_Code != 0);
    return code;
}
/**
 * This API creates a business and stores it in business table
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.create = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.query.user_id })
    if (authorization) {
        if (req.query.unique_name) {

            // Check Unique name should be at least 6 characters length

            if (req.query.unique_name.length < 6) {
                res.status(201).json({
                    status: "Fail",
                    message: "Error: Unique name should be at least 6 characters length"
                });
                throw "Error: Unique name should be at least 6 characters length";
            }

            // Check unique_name already exists
            var count_unique_name = await business.find({ created_by: req.query.user_id, unique_name: req.query.unique_name }).count();

            if (count_unique_name != 0) {
                res.status(201).json({
                    status: "Failed",
                    message: "Business with same unique name already exists"
                });
                throw "Business with same unique name already exists";
            }

            var unique_code = await generateCode.getNextId(req.query.unique_name);
            // Store business in database

            const newbusiness = new business({
                bid: await generateCode.getNextCode(),
                created_at: new Date(),
                created_by: req.query.user_id,
                unique_name: req.query.unique_name,
                unique_code: unique_code,
                name: req.query.name,
                description: req.query.description,
                departments: [],
                roles: []
            });
            await newbusiness.save().then(result => {
                    res.status(200).json({
                        status: "success",
                        message: "Is created business successfull unique_code =" + unique_code,
                    });
                })
                .catch(error => {
                    res.status(201).json({
                        status: "Failed",
                        message: error.message
                    });
                    throw error.message
                });
            // Publish event on Kafka
            //return unique_code;
        } else {
            throw "unique_name is  undefine";
        }
    }
}


/**
 * This API deletes a business from business table
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.delete = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.query.user_id, bid: req.query.bid });
    if (authorization) {
        var query = { created_by: req.query.user_id, bid: req.query.bid };
        if (await business.deleteMany(query)) {
            res.status(200).json({
                status: "success",
                message: "Is delete business successfull"
            });
        } else {
            res.status(201).json({
                status: "faild",
                message: "Is delete business faild"
            });
        }
        // Publish event on Kafka
    }
}


/**
 * This API edit a business
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.edit = async function(req, res) {
    var authorization = await Authorization.authorize({ user_id: req.query.user_id, bid: req.query.bid });
    if (authorization) {
        var query = { created_by: req.query.user_id, bid: req.query.bid };
        var valueUpdate = { $set: { name: req.query.name, decription: req.query.decription } };
        business.updateMany(query, valueUpdate, function(err, result) {
            if (err) {
                console.log("update document error");
                res.status(201).json({
                    status: "faild",
                    message: "Is update business faild"
                });
            } else {
                console.log("update document success");
                res.status(200).json({
                    status: "success",
                    message: "Is update business successfull"
                });
            }
        });
        // Publish event on Kafka
    }
}