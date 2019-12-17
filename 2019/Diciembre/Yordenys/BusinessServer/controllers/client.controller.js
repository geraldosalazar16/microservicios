const clients = require('../models/clients.model');

/**
 * This API creates a Client and stores it in clients table
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.create = async function (req, res) {
    const newClient = new clients({
        clientId: req.body.clientId,
        clientSecret: req.body.clientSecret,
        name: req.body.name,
        title: req.body.title,
        desc: req.body.desc,
        active: req.body.active
    });

    await newClient.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                clientId: result.clientId,
                clientSecret: result.clientSecret,
                status: 200
            });
        })
        .catch(error => {
            console.log(error.message);
            res.status(201).json({
                status: 201,
                message: error.message
            });
        })
}


/**
 * This API deletes a Client from clients table
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.delete = async function (req, res) {

}


/**
 * This API blocks a Client
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.block = async function (req, res) {

}


/**
 * This API unblocks a Client
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.unblock = async function (req, res) {

}


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.list = async function (req, res) {

}
