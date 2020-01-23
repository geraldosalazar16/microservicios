const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const { list } = require('../controllers/permission.controller');

router.post('/list', [
        body('role_id', `user_id cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists(),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(201).json({ errors: errors.array() });
        } else {
            const result = await list(req.body);
            const status = result.status === 'success' ? 200 : 201;
            res.status(status).json(result);
        }
    }
);
module.exports = router;