var express = require('express');
var router = express.Router();
commandController = require('../controllers/commandController');
const { body, validationResult } = require('express-validator');

/**
 * List all commands.
 */
router.post(
  '/list',
  [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('type', `type cant't be undefined`).exists(),
    body('purpose', `purpose cant't be undefined`).exists()
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
      const result = await commandController.list(req.body, req.app.db);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * Check to make sure device is allowed to execute the command.
 */
router.post(
  '/isAllowed',
  [
    body('dev_type', `dev_type cant't be undefined`).exists(),
    body('dev_usage', `dev_usage cant't be undefined`).exists(),
    body('dev_group_id', `dev_group_id cant't be undefined`).exists(),
    body('command_code', `command_code cant't be undefined`).exists()
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
      const result = await commandController.isAllowed(req.body, req.app.db);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * Requests command to be sent to device.
 */
router.post(
  '/send',
  [
    body('user_id', `user_id cant't be undefined`).exists(),
    body('bid', `bid cant't be undefined`).exists(),
    body('code', `code cant't be undefined`).exists(),
    body('args', `args cant't be undefined`).exists(),
    body('dev_id', `dev_id cant't be undefined`).exists(),
    body('dev_serial', `dev_serial cant't be undefined`).exists()
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
      const result = await commandController.send(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

module.exports = router;
