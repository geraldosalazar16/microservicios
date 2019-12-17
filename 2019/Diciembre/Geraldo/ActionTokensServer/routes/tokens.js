var express = require('express');
var router = express.Router();
const validateBody = require('../validators/body');
const { tokenCredentials } = require('../validators/token');
const uuidv4 = require('uuid/v4');
const Aerospike = require('aerospike');
const makeDb = require('../database');
const { random, arrAlphabetic, arrAlphanumeric } = require('../helpers/random');
const filterScan = require('../helpers/filterScan');
const config = require('../config.json');

/**
 * Creates a new standard Token.
 */
router.post('/createStandard', async (req, res) => {
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        try {    
            const tokenInfo = validationBody.body;
            console.log(tokenInfo);
            const aerospikeClient = await makeDb();
            const clientsScan = aerospikeClient.scan(config.aerospike.namespace, 'clients');
            clientsScan.concurrent = true;
            clientsScan.nobins = false;
            // Validate client credentials
            const validToken = await tokenCredentials(tokenInfo, clientsScan);
            if (validToken) {
                const newToken = uuidv4();
                // no other token exists in tokens table with same token value
                const key = new Aerospike.Key(config.aerospike.namespace, 'tokens', newToken);
                const exist = await aerospikeClient.exists(key);
                if (!exist) {
                    const currentDate = new Date();
                    currentDate.setSeconds(currentDate.getSeconds() + parseInt(tokenInfo.expires, 10));
                    const max = tokenInfo.limited ? parseInt(tokenInfo.max) : -1;
                    const finalToken = {
                        token: newToken,
                        used: 0,
                        max,
                        limited: tokenInfo.limited,
                        revoked: "false",
                        created_at: new Date(),
                        created_by: tokenInfo.user_id,
                        purpose: tokenInfo.purpose,
                        payload: tokenInfo.payload,
                        expire_at: currentDate
                    };
                    const aerospikeKey = new Aerospike.Key(config.aerospike.namespace, 'tokens', newToken);
                    await aerospikeClient.put(aerospikeKey, finalToken);
                    res.status(200).send({
                        status: 'success',
                        message: 'Token generated successfully',
                        token: finalToken
                    });
                } else {
                    console.log('Random generated token already exist');
                    res.status(400).send({
                        status: 'failed',
                        message: 'Random generated token already exist'
                    });
                }
            } else {
                console.log('Bad clientId or clientSecret');
                res.status(400).send({
                    status: 'failed',
                    message: 'Bad clientId or clientSecret'
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).send({
                status: 'failed',
                message: error.message
            });
        }
    }
});

/**
 * Creates a new numeric Token.
 */
router.post('/createNumeric', async (req, res) => {
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        const tokenInfo = validationBody.body;
        const aerospikeClient = await makeDb();
        const tokensScan = aerospikeClient.scan(config.aerospike.namespace, 'tokens');
        tokensScan.concurrent = true;
        tokensScan.nobins = false;
        const clientsScan = aerospikeClient.scan(config.aerospike.namespace, 'clients');
        tokensScan.concurrent = true;
        tokensScan.nobins = false;
        // Validate client credentials
        const validToken = await tokenCredentials(tokenInfo, clientsScan);
        if (validToken) {
            // Create token = new config.numericLength digit random number
            const config = require('../config.json');
            const newToken = Math.floor(Math.random() * Math.pow(10, parseInt(config.numericLength)));
            // no other token exists in tokens table with same token value
            const key = new Aerospike.Key(config.aerospike.namespace, 'tokens', newToken);
            const exist = await aerospikeClient.exists(key);
            // Expiry should be less than 24 hours
            if (tokenInfo.expires > 24 * 60 * 60) {
                res.status(400).send({
                    status: 'failed',
                    message: 'Expiry should be less than 24 hours'
                });
            } else if (exist) {
                res.status(400).send({
                    status: 'failed',
                    message: 'Token already exist'
                });
            } else {
                const currentDate = new Date();
                currentDate.setSeconds(currentDate.getSeconds() + parseInt(tokenInfo.expires, 10));
                const max = tokenInfo.limited ? parseInt(tokenInfo.max) : -1;
                const finalToken = {
                    token: newToken,
                    used: 0,
                    max,
                    limited: tokenInfo.limited,
                    revoked: "false",
                    created_at: new Date(),
                    created_by: tokenInfo.user_id,
                    purpose: tokenInfo.purpose,
                    payload: tokenInfo.payload,
                    expire_at: currentDate
                };
                const aerospikeKey = new Aerospike.Key(config.aerospike.namespace, 'tokens', uuidv4());
                await aerospikeClient.put(aerospikeKey, finalToken);
                res.status(200).send({
                    status: 'success',
                    message: 'Token generated successfully',
                    token: finalToken
                });
            }
        } else {
            res.status(400).send({
                status: 'failed',
                message: 'Bad clientId or clientSecret'
            });
        }
    }
});

/**
 * Creates a new alphabetic Token.
 */
router.post('/createAlphabetic', async (req, res) => {
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        const tokenInfo = validationBody.body;
        const aerospikeClient = await makeDb();
        const clientsScan = aerospikeClient.scan(config.aerospike.namespace, 'clients');
        tokensScan.concurrent = true;
        tokensScan.nobins = false;
        // Validate client credentials
        const validToken = await tokenCredentials(tokenInfo, clientsScan);
        if (validToken) {
            // Create token = new config.stringLength digit random number
            const config = require('../config.json');
            const newToken = random(config.stringLegth, arrAlphabetic);
            // no other token exists in tokens table with same token value
            const key = new Aerospike.Key(config.aerospike.namespace, 'tokens', newToken);
            const exist = await aerospikeClient.exists(key);
            // Expiry should be less than 24 hours
            if (tokenInfo.expires > 24 * 60 * 60) {
                res.status(400).send({
                    status: 'failed',
                    message: 'Expiry should be less than 24 hours'
                });
            } else if (exist) {
                res.status(400).send({
                    status: 'failed',
                    message: 'Token already exist'
                });
            } else {
                const currentDate = new Date();
                currentDate.setSeconds(currentDate.getSeconds() + parseInt(tokenInfo.expires, 10));
                const max = tokenInfo.limited ? parseInt(tokenInfo.max) : -1;
                const finalToken = {
                    token: newToken,
                    used: 0,
                    max,
                    limited: tokenInfo.limited,
                    revoked: "false",
                    created_at: new Date(),
                    created_by: tokenInfo.user_id,
                    purpose: tokenInfo.purpose,
                    payload: tokenInfo.payload,
                    expire_at: currentDate
                };
                const aerospikeKey = new Aerospike.Key(config.aerospike.namespace, 'tokens', uuidv4());
                await aerospikeClient.put(aerospikeKey, finalToken);
                res.status(200).send({
                    status: 'success',
                    message: 'Token generated successfully',
                    token: finalToken
                });
            }
        } else {
            res.status(400).send({
                status: 'failed',
                message: 'Bad clientId or clientSecret'
            });
        }
    }
});

/**
 * Creates a new alphanumeric Token.
 */
router.post('/createAlphanumeric', async (req, res) => {
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        const tokenInfo = validationBody.body;
        const aerospikeClient = await makeDb();
        const tokensScan = aerospikeClient.scan(config.aerospike.namespace, 'tokens');
        tokensScan.concurrent = true;
        tokensScan.nobins = false;
        const clientsScan = aerospikeClient.scan(config.aerospike.namespace, 'clients');
        tokensScan.concurrent = true;
        tokensScan.nobins = false;
        // Validate client credentials
        const validToken = await tokenCredentials(tokenInfo, clientsScan);
        if (validToken) {
            // Create token = new config.alphanumericLength digit random number
            const config = require('../config.json');
            const newToken = random(config.alphanumericLength, arrAlphanumeric);
            // no other token exists in tokens table with same token value
            const key = new Aerospike.Key(config.aerospike.namespace, 'tokens', newToken);
            const exist = await aerospikeClient.exists(key);
            // Expiry should be less than 24 hours
            if (tokenInfo.expires > 24 * 60 * 60) {
                res.status(400).send({
                    status: 'failed',
                    message: 'Expiry should be less than 24 hours'
                });
            } else if (exist) {
                res.status(400).send({
                    status: 'failed',
                    message: 'Token already exist'
                });
            } else {
                const currentDate = new Date();
                currentDate.setSeconds(currentDate.getSeconds() + parseInt(tokenInfo.expires, 10));
                const max = tokenInfo.limited ? parseInt(tokenInfo.max) : -1;
                const finalToken = {
                    token: newToken,
                    used: 0,
                    max,
                    limited: tokenInfo.limited,
                    revoked: "false",
                    created_at: new Date(),
                    created_by: tokenInfo.user_id,
                    purpose: tokenInfo.purpose,
                    payload: tokenInfo.payload,
                    expire_at: currentDate
                };
                const aerospikeKey = new Aerospike.Key(config.aerospike.namespace, 'tokens', uuidv4());
                await aerospikeClient.put(aerospikeKey, finalToken);
                res.status(200).send({
                    status: 'success',
                    message: 'Token generated successfully',
                    token: finalToken
                });
            }
        } else {
            res.status(400).send({
                status: 'failed',
                message: 'Bad clientId or clientSecret'
            });
        }
    }
});

/**
 * Tries to use a token.
 */
router.post('/use', async (req, res) => {
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        const receivedToken = validationBody.body;
        try {            
            // Get token_info row from tokens table using token parameter
            const aerospikeClient = await makeDb();
            const key = new Aerospike.Key(config.aerospike.namespace, 'tokens', receivedToken.token);
            const record = await aerospikeClient.get(key);
            const tokenRecord = record.bins;
            if (!tokenRecord) {
                res.status(400).send({
                    status: 'failed',
                    message: 'Invalid or expired token'
                });
            } else {
                const expire_at = tokenRecord.expire_at;
                const invalidToken = tokenRecord.revoked === 'true'
                    || expire_at < new Date()
                    || (tokenRecord.limited === "true" && (tokenRecord.used > tokenRecord.max))
                    || receivedToken.purpose !== tokenRecord.purpose;
                if (invalidToken) {
                    res.status(400).send({
                        status: 'failed',
                        message: 'Invalid or expired token'
                    });
                } else {
                    const used = tokenRecord.used + 1;
                    const op = Aerospike.operations;
                    const ops = [
                        op.write('used', used)
                    ];
                    if (tokenRecord.limited === 'true') {
                        if (used > tokenRecord.max) {
                            // Remove from database
                            await aerospikeClient.remove(key);
                        } else {
                            // Update token info with new used value
                            await aerospikeClient.operate(key, ops);
                        }
                    } else {
                        // Update token info with new used value
                        await aerospikeClient.operate(key, ops);
                    }
                    // Create new row in usage_history table
                    const history = {
                        token: tokenRecord.token,
                        created_by: tokenRecord.created_by,
                        created_at: tokenRecord.created_at,
                        used_by: receivedToken.user_id,
                        used_at: new Date(),
                        porpuse: tokenRecord.purpose,
                        payload: tokenRecord.payload,
                        expire_at: tokenRecord.expire_at
                    }
                    const historyKey = new Aerospike.Key(config.aerospike.namespace, 'usage_history', uuidv4());
                    await aerospikeClient.put(historyKey, history);
                    res.status(200).send({
                        status: 'success',
                        message: 'Token available',
                        payload: tokenRecord.payload
                    });
                }
            }
        } catch (error) {
            res.status(400).send({
                status: 'failed',
                message: error.message
            });
        }
    }
});

module.exports = router;