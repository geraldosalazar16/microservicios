const express = require('express');
const router = express.Router();
const { body, validationResult, check } = require('express-validator');
const { create, edit, del, list } = require('../controllers/department.controller');



router.post('/create', [
        body('user_id', `user_id cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists(),
        body('dep_name', `dep_name cant't be undefined`).exists(),
        body('dep_title', `dep_title cant't be undefined`).exists(),
        body('dep_desc', `dep_desc cant't be undefined`).exists(),
        check('dep_name').isLength({ min: 4 }).withMessage("dep_name must be greater than 4")
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
        body('dep_id', `dep_id cant't be undefined`).exists(),
        body('name', `name cant't be undefined`).exists(),
        body('decription', `decription cant't be undefined`).exists(),
        check('name').isLength({ min: 4 }).withMessage("name must be greater than 4")
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(201).json({ errors: errors.array() });
        } else {
            const result = await edit(req.body);
            const status = result.status === 'success' ? 200 : 201;
            res.status(status).json(result);
        }
    }
);


router.post('/delete', [
        body('user_id', `user_id cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists(),
        body('dep_id', `dep_id cant't be undefined`).exists(),
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

router.post('/list', [
        body('user_id', `user_id cant't be undefined`).exists(),
        body('bid', `bid cant't be undefined`).exists(),
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

module.exports = router;