const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const { create, update, del, list, get } = require('../controllers/rule.controller');


//Creates a pattern for the channel
router.post('/create', [
        body('clientId', `clientId cant't be undefined`).exists(),
        body('clientSecret', `clientSecret cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists(),
        body('chid', `chid cant't be undefined`).exists(),
        body('variation', `variation cant't be undefined`).exists(),
        body('conditions', `conditions cant't be undefined`).exists()
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

//Updates a rule of the channel.
router.post('/update', [
        body('clientId', `clientId cant't be undefined`).exists(),
        body('clientSecret', `clientSecret cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists(),
        body('chid', `chid cant't be undefined`).exists(),
        body('variation', `variation cant't be undefined`).exists(),
        body('conditions', `conditions cant't be undefined`).exists()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(201).json({ errors: errors.array() });
        } else {
            const result = await update(req.body);
            const status = result.status === 'success' ? 200 : 201;
            res.status(status).json(result);
        }
    }
);

//Deletes a rule of the channel.
router.post('/delete', [
        body('clientId', `clientId cant't be undefined`).exists(),
        body('clientSecret', `clientSecret cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists(),
        body('chid', `bid cant't be undefined`).exists()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(201).json({ errors: errors.array() });
        } else {
            const result = await del(req.body);
            const status = result.status === 'success' ? 200 : 201;
            res.status(status).json(result);
        }
    }
);

//List all rule of the business.
router.post('/list', [
        body('clientId', `clientId cant't be undefined`).exists(),
        body('clientSecret', `clientSecret cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(201).json({ errors: errors.array() });
        } else {
            const result = await list(req.body);
            res.status(200).json(result);
        }
    }
);

//Get a rule from database.
router.post('/get', [
        body('clientId', `clientId cant't be undefined`).exists(),
        body('clientSecret', `clientSecret cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists(),
        body('chid', `chid cant't be undefined`).exists()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(201).json({ errors: errors.array() });
        } else {
            const result = await get(req.body);
            const status = result.status === 'success' ? 200 : 201;
            res.status(status).json(status == 200 ? result.rule : result);
        }
    }
);

module.exports = router;