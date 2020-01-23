var express = require('express');
var router = express.Router();
order = require('../controllers/orderController');
const { body, validationResult } = require('express-validator');

/**
 * Creates a new order.
 */
router.post(
  '/create',
  [
    body('bid', `bid cant't be undefined`).exists(),
    body('user_id', `user_id cant't be undefined`).exists(), 
    body('dev_id', `dev_id cant't be undefined`).exists(),
    body('dev_serial', `dev_serial cant't be undefined`).exists(),
    body('order_info', `order_info cant't be undefined`).exists()
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
      const result = await order.create(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * List orders of the business.
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
      res.status(422).json({
        status: 'failed',
        message: 'Some parameters were invalid',
        errors: errors.array()
      });
    } else {
      const result = await order.list(req.body);
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
      const result = await order.listByChannel(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

module.exports = router;
