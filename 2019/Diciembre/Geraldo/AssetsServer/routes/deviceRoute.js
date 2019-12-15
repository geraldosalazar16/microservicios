var express = require('express');
var router = express.Router();
const {
  invite,
  join,
  revoke,
  leave
} = require('../controllers/deviceController');
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
router.post(
  '/join',
  [
    body('dev_id', `dev_id cant't be undefined`).exists(),
    body('dev_serial', `dev_serial cant't be undefined`).exists(),
    body('invitation_code', `invitation_code cant't be undefined`).exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const result = await join(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * Request to revoke a device from business assets list.
 */
router.post(
  '/revoke', 
  [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('target_dev_id', `target_dev_id cant't be undefined`).exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const result = await revoke(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * Request to leave the position in system.
 */
router.post(
  '/leave',
  [
    body('dev_id', `dev_id cant't be undefined`).exists(),
    body('dev_serial', `dev_serial cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists()
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const result = await leave(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * List members of a business.
 */
router.post(
  '/list',
  [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists()
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const result = await list(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

module.exports = router;
