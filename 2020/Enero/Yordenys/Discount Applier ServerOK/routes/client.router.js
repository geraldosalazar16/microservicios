const express = require('express');
const router = express.Router();
const { body, validationResult, check, query } = require('express-validator');
const { del, create, block, unblock, list } = require('../controllers/client.controller');

//This API creates a Client and stores it in clients table.
router.post('/create', [
        body('masterId', `masterId cant't be undefined`).exists(),
        body('masterSecret', `masterSecret cant't be undefined`).exists(),
        body('name', `name cant't be undefined`).exists(),
        body('title', `title cant't be undefined`).exists(),
        body('desc', `desc cant't be undefined`).exists(),
    ],
    async(req, res) => {
        //ckecking data
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

//This API block a Client and stores it in clients table.
router.post('/block', [
    body('masterId', `masterId cant't be undefined`).exists(),
    body('masterSecret', `masterSecret cant't be undefined`).exists(),
], async(req, res) => {
    //ckecking data
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {
        //return result
        const result = await block(req.body);
        const status = result.status === 'success' ? 200 : 201;
        res.status(status).json(result);
    }
});

//This API unblock a Client and stores it in clients table.
router.post('/unblock', [
    body('masterId', `masterId cant't be undefined`).exists(),
    body('masterSecret', `masterSecret cant't be undefined`).exists()
], async(req, res) => {
    //ckecking data
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {
        //return result
        const result = await unblock(req.body);
        const status = result.status === 'success' ? 200 : 201;
        res.status(status).json(result);
    }
});


//This API deletes a Client from clients table.
router.post('/delete', [
    body('masterId', `masterId cant't be undefined`).exists(),
    body('masterSecret', `masterSecret cant't be undefined`).exists()
], async(req, res) => {
    //ckecking data
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {
        //return result
        const result = await del(req.body);
        const status = result.status === 'success' ? 200 : 201;
        res.status(status).json(result);
    }
});
//This API list a Client and stores it in clients table.
router.post('/list', [
    body('masterId', `masterId cant't be undefined`).exists(),
    body('masterSecret', `masterSecret cant't be undefined`).exists(),
    body('masterId', `masterId cant't be undefined`).exists()
], async(req, res) => {
    //ckecking data
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(201).json({ errors: errors.array() });
    } else {

        //return result
        const result = await list(req.body);
        const status = result.status === 'success' ? 200 : 201;
        res.status(status).json(result);
    }
});



module.exports = router;