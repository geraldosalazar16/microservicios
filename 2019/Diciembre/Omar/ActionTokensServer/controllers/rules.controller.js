const rules = require('../models/rules.model');
const AuthorizationEngine = require('../helpers/AuthorizationEngine');

/**
 * Sets rule for the api
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.set = async function (req, res) {
    try {
        if (req.body.clientId && req.body.apiId) {
            if (req.body.checklist) {
                AuthorizationEngine.parse(req.body.checklist)
                    .then(function (response) {
                        var newRules = new rules({
                            clientId: req.body.clientId,
                            apiId: req.body.apiId,
                            conditions: response
                        });

                        newRules.save().then(function (res1) {
                            res.status(200).json({
                                status: 200,
                                message: 'Rule api'
                            });
                        }).catch(function (err) {
                            res.status(400).json({
                                status: 'failed',
                                message: err.message
                            });
                        });
                    })
                    .catch(function (err) {
                        res.status(400).json({
                            status: 'failed',
                            message: err.message
                        });
                    })
            } else {
                res.status(400).json({
                    status: 'failed',
                    message: 'Parameters { checklist } required'
                });
            }
        } else {
            res.status(400).json({
                status: 'failed',
                message: 'Parameters { clientId } or { apiId } required'
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * Gets list of rules of this client
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.getall = async function (req, res) {
    try {
        if (req.body.clientId) {
            await rules.findOne({clientId: req.body.clientId})//.select('name title desc clientId active')
                .then(function (listRules) {
                    res.send(listRules.conditions);
                }).catch(function (err) {
                    res.status(400).json({
                        status: 'failed',
                        message: e.message
                    });
                });
        } else {
            res.status(400).json({
                status: 'failed',
                message: 'Parameters { clientId } required'
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
}


/**
 * Deletes a rule
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.delete = async function (req, res) {
    try {
        if (req.body.clientId || req.body.apiId) {
            rules.deleteOne({
                clientId: req.body.clientId,
                apiId: req.body.apiId
            }, function (err, res1) {
                if (err) {
                    return res.status(400).json({
                        status: 'failed',
                        message: err.message
                    });
                }

                if (res1.deletedCount == 0) {
                    res.status(201).json({
                        status: 'failed',
                        message: 'There is no item with this search criteria'
                    });
                } else {
                    res.status(200).json({
                        status: 'success',
                        message: 'Rule removed succesfully'
                    });
                }
            });
        } else {
            res.status(400).json({
                status: 'failed',
                message: 'Parameters { clientId } or { apiId } required'
            });
        }
    } catch (e) {
        res.status(500).json({
            status: 'failed',
            message: e.message
        });
    }
}