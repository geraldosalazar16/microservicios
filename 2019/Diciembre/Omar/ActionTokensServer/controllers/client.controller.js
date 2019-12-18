const clients = require('../models/clients.model');
const uuidv4 = require('uuid/v4');
const {validationResult} = require('express-validator');
const hashSha512 = require('../helpers/hash');

/**
 * This API creates a Client and stores it in clients table
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.create = async function (req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            const currentDate = new Date().toString();
            const clientId = uuidv4();
            const clientSecret = hashSha512(req.body.name + currentDate);

            const newClient = new clients({
                clientId: clientId,
                clientSecret: clientSecret,
                name: req.body.name,
                title: req.body.title,
                desc: req.body.desc,
                active: true
            });

            await newClient.save()
                .then(result => {
                    console.log(result);
                    res.status(200).json({
                        clientId: result.clientId,
                        clientSecret: result.clientSecret,
                        status: 'success',
                        message: 'Client created succesfully'
                    });
                })
                .catch(error => {
                    console.log(error.message);
                    res.status(400).json({
                        status: 'failed',
                        message: error.message
                    });
                });
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * This API deletes a Client from clients table
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.delete = async function (req, res) {
    try {
        if (req.body.clientId || req.body.name) {
            if (req.body.clientId) {
                clients.deleteOne({clientId: req.body.clientId}, function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    if (res1.deletedCount == 0) {
                        res.status(400).json({
                            status: 'failed',
                            message: 'There is no item with this search criteria'
                        });
                    } else {
                        res.status(200).json({
                            status: 'success',
                            message: 'Client removed succesfully'
                        });
                    }
                });
            }

            if (req.body.name) {
                clients.deleteOne({name: req.body.name}, function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    if (res1.deletedCount == 0) {
                        res.status(400).json({
                            status: 'failed',
                            message: 'There is no item with this search criteria'
                        });
                    } else {
                        res.status(200).json({
                            status: 'success',
                            message: 'Client removed succesfully'
                        });
                    }
                });
            }
        } else {
            res.status(400).json({
                status: 'failed',
                message: 'Parameters { clientId } or { name } required'
            });
        }
        clients.deleteOne({clientId: req.body.clientId});
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * This API blocks a Client
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.block = async function (req, res) {
    try {
        if (req.body.clientId || req.body.name) {
            if (req.body.clientId) {
                await clients.updateOne({clientId: req.body.clientId}, {active: false}, {runValidators: true}, function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    if (res1.nModified == 0) {
                        res.status(400).json({
                            status: 'failed',
                            message: 'There is no item with this search criteria'
                        });
                    } else {
                        res.status(200).json({
                            status: 'success',
                            message: 'Client blocked succesfully'
                        });
                    }
                });
            }

            if (req.body.name) {
                await clients.updateOne({name: req.body.name}, {active: false}, {runValidators: true}, function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    if (res1.nModified == 0) {
                        res.status(400).json({
                            status: 'failed',
                            message: 'There is no item with this search criteria'
                        });
                    } else {
                        res.status(200).json({
                            status: 'success',
                            message: 'Client blocked succesfully'
                        });
                    }
                });
            }
        } else {
            res.status(400).json({
                status: 'failed',
                message: 'Parameters { clientId } or { name } required'
            });
        }
        clients.deleteOne({clientId: req.body.clientId});
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * This API unblocks a Client
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.unblock = async function (req, res) {
    try {
        if (req.body.clientId || req.body.name) {
            if (req.body.clientId) {
                await clients.updateOne({clientId: req.body.clientId}, {active: true}, {runValidators: true}, function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    if (res1.nModified == 0) {
                        res.status(400).json({
                            status: 'failed',
                            message: 'There is no item with this search criteria'
                        });
                    } else {
                        res.status(200).json({
                            status: 'success',
                            message: 'Client unblocked succesfully'
                        });
                    }
                });
            }

            if (req.body.name) {
                await clients.updateOne({name: req.body.name}, {active: true}, {runValidators: true}, function (err, res1) {
                    if (err) {
                        return res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    }

                    if (res1.nModified == 0) {
                        res.status(400).json({
                            status: 'failed',
                            message: 'There is no item with this search criteria'
                        });
                    } else {
                        res.status(200).json({
                            status: 'success',
                            message: 'Client blocked succesfully'
                        });
                    }
                });
            }
        } else {
            res.status(400).json({
                status: 'failed',
                message: 'Parameters { clientId } or { name } required'
            });
        }
        clients.deleteOne({clientId: req.body.clientId});
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.list = async function(req, res) {
    try {
        // validation error
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'failed',
                message: errors.errors[0].msg
            });
        } else {
            await clients.find({clientId: req.body.clientId}).select('name title desc clientId active')
                .then(function (clientes) {
                    res.send(clientes);
                }).catch(function (err) {
                    res.status(400).json({
                        status: 'failed',
                        message: e.message
                    });
                });
        }
    } catch (e) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}
