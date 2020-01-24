const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const { apply } = require('../lib/engine');

// Modify the prices based on the channel and conditions.
router.post('/apply', [
        body('clientId', `clientId cant't be undefined`).exists(),
        body('clientSecret', `clientSecret cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists(),
        body('chid', `chid cant't be undefined`).exists(),
        body('items', `items cant't be undefined`).exists()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(201).json({ errors: errors.array() });
        } else {
            const result = await apply(req.body);
            const status = Array.isArray(result) ? 200 : 201;
            res.status(status).json(result);
        }
    }
);
module.exports = router;