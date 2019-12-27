var express = require('express');
var router = express.Router();
whitelist = require('../controllers/whitelistController');
const { body, validationResult, sanitizeBody } = require('express-validator');

/**
 * Add user to whitelist.
 */
router.post(
    '/add',
    [
        body('user_id', `user_id cant't be undefined`).exists(),
        body('chid', `chid cant't be undefined`).not().isEmpty().trim().escape(),
        body('peer_id', `peer_id cant't be undefined`).exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                status: 'failed',
                message: 'Some parameters were invalid',
                errors: errors.array()
            });
        } else {
            const result = await whitelist.add(req.body);
            const status = result.status === 'success' ? 200 : 400;
            res.status(status).json(result);
        }
    }
);

/**
* User removed from whitelist.
*/
router.post(
    '/remove',
    [
        body('user_id', `user_id cant't be undefined`).exists(),
        body('chid', `chid cant't be undefined`).not().isEmpty().trim().escape(),
        body('peer_id', `peer_id cant't be undefined`).exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                status: 'failed',
                message: 'Some parameters were invalid',
                errors: errors.array()
            });
        } else {
            const result = await whitelist.remove(req.body);
            const status = result.status === 'success' ? 200 : 400;
            res.status(status).json(result);
        }
    }
);

/**
* List whitelisted users of channel.
*/
router.post(
    '/list',
    [
        body('user_id', `user_id cant't be undefined`).exists(),
        body('chid', `chid cant't be undefined`).not().isEmpty().trim().escape()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({
                status: 'failed',
                message: 'Some parameters were invalid',
                errors: errors.array()
            });
        } else {
            const result = await whitelist.list(req.body);
            const status = result.status === 'success' ? 200 : 400;
            res.status(status).json(result);
        }
    }
);

module.exports = router;
