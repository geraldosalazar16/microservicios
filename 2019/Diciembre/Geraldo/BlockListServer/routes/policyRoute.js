var express = require('express');
var router = express.Router();
policy = require('../controllers/policyController');
const { body, validationResult } = require('express-validator');

/**
 * Set Policy for channel
 */
router.post(
  '/set',
  [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('chid', `chid cant't be undefined`).not().isEmpty().trim().escape(), 
    body('policy', `Invalid policy`).isIn(['whitelist', 'blacklist'])
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
      const result = await policy.set(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * Get Policy of channel
 */
router.post(
  '/get',
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
      const result = await policy.get(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

module.exports = router;
