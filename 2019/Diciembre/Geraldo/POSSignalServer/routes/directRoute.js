var express = require('express');
var router = express.Router();
direct = require('../controllers/directController');
const { body, validationResult } = require('express-validator');

/**
 * User asks for publish on channel.
 */
router.post(
  '/pub',
  [
    body('user_id', `user_id cant't be undefined`).exists(), 
    body('bid', `bid cant't be undefined`).exists(),
    body('dev_id', `dev_id cant't be undefined`).exists(),
    body('dev_serial', `dev_serial cant't be undefined`).exists(),
    body('name', `name cant't be undefined`).exists()
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
      const result = await direct.pub(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * User asks to subscribe on channel.
 */
router.post(
  '/sub',
  [
    body('user_id', `user_id cant't be undefined`).exists(), 
    body('bid', `bid cant't be undefined`).exists(),
    body('dev_id', `dev_id cant't be undefined`).exists(),
    body('dev_serial', `dev_serial cant't be undefined`).exists(),
    body('name', `name cant't be undefined`).exists()
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
      const result = await direct.sub(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * List orders of the business.
 */
router.post(
  '/listByChannel',
  [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('chid', `chid cant't be undefined`).exists()
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
      const result = await direct.sub(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

module.exports = router;
