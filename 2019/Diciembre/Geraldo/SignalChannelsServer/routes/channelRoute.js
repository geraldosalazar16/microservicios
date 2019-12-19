var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/channelController');

/**
 * Request server a channel name or a new channel.
 */
router.post(
  '/request',
  [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('dev_id', `dev_id cant't be undefined`).exists(),
    body('dev_serial', `dev_serial cant't be undefined`).exists(),
    body('type', `type cant't be undefined`).exists(),
    body('purpose', `purpose cant't be undefined`).exists(),
    body('attrib', `attrib cant't be undefined`).exists(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        status: 'failed',
        message: 'Some parameters were invalid',
        errors: errors.array()
      });
    } else {
      const result = await controller.request(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  });

/**
 * Check user is allowed to publish on this channel.
 */
router.post(
  '/isPubAllowed',
  [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('dev_id', `dev_id cant't be undefined`).exists(),
    body('dev_serial', `dev_serial cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('name', `name cant't be undefined`).exists()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const result = await controller.isPubAllowed(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * Check user is allowed to subscribe to this channel.
 */
router.post(
  '/isSubAllowed',
  [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('dev_id', `dev_id cant't be undefined`).exists(),
    body('dev_serial', `dev_serial cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('name', `name cant't be undefined`).exists()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const result = await controller.isPubAllowed(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);


module.exports = router;
