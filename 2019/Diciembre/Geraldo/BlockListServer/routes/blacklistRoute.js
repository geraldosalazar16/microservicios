var express = require('express');
var router = express.Router();
blacklist = require('../controllers/blacklistController');
const { body, validationResult, sanitizeBody } = require('express-validator');

/**
 * Add user to blacklist.
 */
router.post(
    '/add',
    [
        body('user_id', `user_id cant't be undefined`).exists(),
        body('chid', `chid cant't be undefined`).not().isEmpty().trim().escape(),
        body('peer_id', `peer_id cant't be undefined`).exists(),
        sanitizeBody('temporary', 'temporary must be a valid boolean value').toBoolean(),
        body('till', `till must be a valid ISO8601 date`)
            .isISO8601()
            .toDate()
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
            const result = await blacklist.add(req.body);
            const status = result.status === 'success' ? 200 : 400;
            res.status(status).json(result);
        }
    }
);

/**
* User removed from blacklist.
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
            const result = await blacklist.remove(req.body);
            const status = result.status === 'success' ? 200 : 400;
            res.status(status).json(result);
        }
    }
);

/**
* List blacklisted users of channel.
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
            const result = await blacklist.list(req.body);
            const status = result.status === 'success' ? 200 : 400;
            res.status(status).json(result);
        }
    }
);

module.exports = router;
