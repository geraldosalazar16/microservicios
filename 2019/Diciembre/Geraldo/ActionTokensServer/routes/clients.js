var express = require('express');
var router = express.Router();
const validateCredentials = require('../helpers/config');
const Aerospike = require('aerospike');
const uuidv4 = require('uuid/v4');
const hashSha512 = require('../helpers/hash');
const makeDb = require('../database');
const validateBody = require('../validators/body');
const scanner = require('../helpers/scan');

/**
 * Creates a Client and stores it in clients table.
 */
router.post('/create', async (req, res) => {
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        try {
            const clientInfo = validationBody.body;
            if (validateCredentials(clientInfo)) {
                try {
                    const clientId = uuidv4();
                    const key = new Aerospike.Key('test', 'clients', clientId);
                    const currentDate = new Date().toString();
                    const clientSecret = hashSha512(clientInfo.name + currentDate);
                    Object.assign(clientInfo, { clientId, clientSecret, active: 'true' });
                    console.log(clientInfo);
                    const aerospikeClient = await makeDb();
    
                    const putResult = await aerospikeClient.put(key, clientInfo);
                    res.status(201).send({
                        status: 'success',
                        message: 'Client created succesfully',
                        data: JSON.stringify({clientSecret, clientId})
                    });
                } catch (error) {
                    res.status(400).send({
                        status: 'failed',
                        message: error.message
                    });
                }
    
            } else {
                res.status(400).send({
                    status: 'failed',
                    message: 'Invalid credentials provided'
                });
            }
    
        } catch (e) {
            res.status(500).send({
                status: 'failed',
                message: e.message,
            });
        }
    }
})

/**
 * Deletes a Client from clients table.
 */
router.post('/delete', async (req, res) => {
    
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        try {
            const clientInfo = validationBody.body;
            if (validateCredentials(clientInfo)) {
                try {
                    const aerospikeClient = await makeDb();
                    if (clientInfo.clientId) {
                        const key = new Aerospike.Key('test', 'clients', clientInfo.clientId);

                        const result = await aerospikeClient.remove(key);
                        console.log(result);
                        res.status(201).send({
                            status: 'success',
                            message: 'Client removed succesfully'
                        });
                    } else if (clientInfo.clientName) {
                        const query = aerospikeClient.query('test', 'clients');
                        query.where(Aerospike.filter.equal('name', clientInfo.clientName));
                        const results = await scanner(query);
                        const client = results.records[0];
                        if (client) {
                            const result = await aerospikeClient.remove(client.key);
                            console.log(result);
                            res.status(201).send({
                                status: 'success',
                                message: 'Client removed succesfully'
                            });
                        } else {
                            res.status(400).send({
                                status: 'failed',
                                message: 'The client does not exist in the database'
                            });
                        }
                    } else {
                        res.status(400).send({
                            status: 'failed',
                            message: 'The client does not exist in the database'
                        });
                    }
                    
                } catch (error) {
                    res.status(400).send({
                        status: 'failed',
                        message: error.message
                    });
                }
    
            } else {
                res.status(400).send({
                    status: 'failed',
                    message: 'Invalid credentials provided'
                });
            }
    
        } catch (e) {
            res.status(500).send({
                status: 'failed',
                message: e.message,
            });
        }
    }
});

/**
 * Block a client.
 */
router.post('/block', async (req, res) => {
    
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        try {
            const clientInfo = validationBody.body;
            if (validateCredentials(clientInfo)) {
                try {
                    const aerospikeClient = await makeDb();
                    const op = Aerospike.operations;
                    const ops = [
                        op.write('active', 'false')
                    ];
                    let key;
                    if (clientInfo.clientId) {                        
                        key = new Aerospike.Key('test', 'clients', clientInfo.clientId);                      
                    } else if (clientInfo.clientName) {
                        const query = aerospikeClient.query('test', 'clients');
                        query.where(Aerospike.filter.equal('name', clientInfo.clientName));
                        const results = await aerospikeClient.info(query);
                        const client = results.records[0];
                        key = client.key;
                    } else {
                        res.status(400).send({
                            status: 'failed',
                            message: 'The client does not exist in the database'
                        });
                    }
                    if (key) {
                        const result = await aerospikeClient.operate(key, ops);

                        res.status(201).send({
                            status: 'success',
                            message: 'Client blocked succesfully'
                        });
                    }                    
                } catch (error) {
                    res.status(400).send({
                        status: 'failed',
                        message: error.message
                    });
                }
    
            } else {
                res.status(400).send({
                    status: 'failed',
                    message: 'Invalid credentials provided'
                });
            }
    
        } catch (e) {
            res.status(500).send({
                status: 'failed',
                message: e.message,
            });
        }
    }
});

/**
 * List all clients.
 */
router.post('/list', async (req, res) => {
    
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        try {
            const clientInfo = validationBody.body;
            if (validateCredentials(clientInfo)) {
                try {
                    const aerospikeClient = await makeDb();
                    const scan = aerospikeClient.scan('test', 'clients')
                    scan.concurrent = true
                    scan.nobins = false
                    const result = await scanner(scan);
                    let resultMessage;
                    if (result.errors.lenght > 0) {
                        resultMessage = 'Clients listed with errors'
                    } else {
                        resultMessage = 'Clients listed succesfully';
                    }
                    res.status(201).send({
                        status: 'success',
                        message: resultMessage,
                        errors: result.errors,
                        clients: result.records
                    });
                } catch (error) {
                    res.status(400).send({
                        status: 'failed',
                        message: error.message
                    });
                }
    
            } else {
                res.status(400).send({
                    status: 'failed',
                    message: 'Invalid credentials provided'
                });
            }
    
        } catch (e) {
            res.status(500).send({
                status: 'failed',
                message: e.message,
            });
        }
    }
});

/**
 * Blocks a client.
 */
router.post('/block', async (req, res) => {
    
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        try {
            const clientInfo = validationBody.body;
            if (validateCredentials(clientInfo)) {
                try {
                    const key = new Aerospike.Key('test', 'clients', clientInfo.clientId);
                    const aerospikeClient = await makeDb();
    
                    const result = await aerospikeClient.remove(key);
                    console.log(result);
                    res.status(201).send({
                        status: 'success',
                        message: 'Client removed succesfully'
                    });
                } catch (error) {
                    res.status(400).send({
                        status: 'failed',
                        message: error.message
                    });
                }
    
            } else {
                res.status(400).send({
                    status: 'failed',
                    message: 'Invalid credentials provided'
                });
            }
    
        } catch (e) {
            res.status(500).send({
                status: 'failed',
                message: e.message,
            });
        }
    }
});




module.exports = router;
