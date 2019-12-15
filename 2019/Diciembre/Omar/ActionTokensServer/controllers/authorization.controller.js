const clients = require('../models/clients.model');
const rules = require('../models/rules.model');
const AuthorizationEngine = require('../helpers/AuthorizationEngine');


module.exports = async (req, res) => {
    try {
        if (req.body.clientId && req.body.clientSecret) {
            await clients.find({
                clientId: req.body.clientId,
                clientSecret: req.body.clientSecret,
                active: true
            }).select('name title desc clientId active')
                .then(function (clientes) {
                    rules.find({
                        clientId: req.body.clientId,
                        apiId: req.body.apiId
                    }).then(function (listRules) {
                        AuthorizationEngine.authorize(req.body.params, listRules)
                            .then(function (res1) {
                                res.status(200).json({
                                    status: 'success',
                                    message: 'Authorizes a request'
                                });
                            })
                            .catch(function (err) {
                                res.status(400).json({
                                    status: 'failed',
                                    message: e.message
                                });
                            })
                    })
                        .catch(function (err) {
                            res.status(400).json({
                                status: 'failed',
                                message: e.message
                            });
                        });

                }).catch(function (err) {
                    res.status(400).json({
                        status: 'failed',
                        message: e.message
                    });
                });
        } else {
            res.status(400).json({
                status: 'failed',
                message: 'Parameters { clientId } or { clientSecret } required'
            });
        }
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: e.message
        });
    }
}