var express = require('express');
var router = express.Router();
const { validateInvite, invite } = require('../controllers/deviceController');
const { body, validationResult } = require('express-validator');

/**
 * Request to invite some other device to this business.
 */
router.post(
  '/invite',
  [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('title', `title cant't be undefined`).exists(),
    body('desc', `desc cant't be undefined`).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const result = await invite(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * Join via invitation code.
 */
router.post('/join', function(req, res, next) {

});

/**
 * Request to revoke a device from business assets list.
 */
router.post('/revoke', function(req, res, next) {

});

/**
 * Request to leave the position in system.
 */
router.post('/leave', function(req, res, next) {

});

/**
 * List members of a business.
 */
router.post('/list', function(req, res, next) {

});

module.exports = router;
