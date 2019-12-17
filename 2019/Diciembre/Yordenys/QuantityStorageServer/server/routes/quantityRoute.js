var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const controller = require('../controllers/quantityController');

/**
 * Sets value of quantity in database.
 */
router.post('/set',
  [
    body('bid', `bid cant't be undefined`).exists(),
    body('reference', `reference cant't be undefined`).exists(),
    body('value', `value cant't be undefined`).exists(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const result = await controller.set(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  });

/**
 * Update value of quantity in database.
 */
router.post(
  '/update',
  [
    body('bid', `bid cant't be undefined`).exists(),
    body('reference', `reference cant't be undefined`).exists(),
    body('amount', `amount cant't be undefined`).exists(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      const result = await controller.update(req.body);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

router.post('/get', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/batchSet', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/batchUpdate', function (req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
