const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const { del, create, edit } = require('../controllers/business.controller');

router.post('/create', [
        body('user_id', `user_id cant't be undefined`).exists(),
        body('unique_name', `unique_name cant't be undefined`).exists(),
        body('name', `name cant't be undefined`).exists(),
        body('decription', `decription cant't be undefined`).exists(),
        check('unique_name').isLength({ min: 6 }).withMessage("unique_name must be greater than 6")
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(201).json({ errors: errors.array() });
        } else {
            const result = await create(req.body);
            const status = result.status === 'success' ? 200 : 201;
            res.status(status).json(result);
        }
    }
);

router.post('/edit', [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('name', `name cant't be undefined`).exists(),
    body('decription', `decription cant't be undefined`).exists(),
    check('name').isLength({ min: 6 }).withMessage("name must be greater than 6")
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {
        const result = await edit(req.body);
        const status = result.status === 'success' ? 200 : 201;
        res.status(status).json(result);
    }
});

router.post('/delete', [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {
        const result = await del(req.body);
        const status = result.status === 'success' ? 200 : 201;
        res.status(status).json(result);
    }
});

module.exports = router;