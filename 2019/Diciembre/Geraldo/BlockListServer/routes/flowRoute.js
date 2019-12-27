var express = require('express');
var router = express.Router();
flow = require('../controllers/flowController');
const { body, validationResult } = require('express-validator');

/**
 * Check user can contact the channel.
 */
router.post(
  '/isContactAllowed',
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
      const result = await flow.isContactAllowed(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

module.exports = router;
