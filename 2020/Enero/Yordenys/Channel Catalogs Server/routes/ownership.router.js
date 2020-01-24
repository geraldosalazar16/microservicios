const express = require('express');
const router = express.Router();
const { body, validationResult, check, query } = require('express-validator');
const { bind, bindAll, unbind, unbindAll, get, list } = require('../controllers/ownership.controller');

//Bind a catalog to a channel
router.post('/bind', [
        body('user_id', `user_id cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists(),
        body('chid', `chid cant't be undefined`).exists(),
        body('gid', `gid cant't be undefined`).exists()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(201).json({ errors: errors.array() });
        } else {
            const result = await bind(req.body);
            const status = result.status === 'success' ? 200 : 201;
            res.status(status).json(result);
        }
    }
);

//Bind a group of catalogs to a channel
router.post('/bindAll', [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('chid', `chid cant't be undefined`).exists(),
    body('gids', `gid cant't be undefined`).exists()
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {
        const result = await bindAll(req.body);
        const status = result.status === 'success' ? 200 : 201;
        res.status(status).json(result);
    }
});

//Unbind a catalog from a channel
router.post('/unbind', [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('chid', `chid cant't be undefined`).exists(),
    body('gid', `gid cant't be undefined`).exists()
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {
        const result = await unbind(req.body);
        const status = result.status === 'success' ? 200 : 201;
        res.status(status).json(result);
    }
});

//Unbind a group of catalogs from a channel
router.post('/unbindAll', [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('chid', `chid cant't be undefined`).exists(),
    body('gids', `gid cant't be undefined`).exists()
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {
        const result = await unbindAll(req.body);
        const status = result.status === 'success' ? 200 : 201;
        res.status(status).json(result);
    }
});

//Get bid and chid of a catalog
router.post('/get', [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('gid', `gid cant't be undefined`).exists()
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {
        const result = await get(req.body, res);
        if (result)
            res.status(201).json(result);
    }
});

//List catalogs of a channel.
router.post('/list', [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('chid', `chid cant't be undefined`).exists(),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {
        const result = await list(req.body, res);
        if (result)
            res.status(201).json(result);
    }
});
module.exports = router;