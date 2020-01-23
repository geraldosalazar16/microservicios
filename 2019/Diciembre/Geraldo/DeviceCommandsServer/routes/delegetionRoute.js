var express = require('express');
var router = express.Router();
commandController = require('../controllers/commandController');
const { check, validationResult, sanitizeBody } = require('express-validator');
const delegateController = require('../controllers/delegateController');

/**
 * Generate a delegated command.
 */
router.post(
  '/generate', 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({
        status: 'failed',
        message: 'Some parameters were invalid',
        errors: errors.array()
      });
    } else {
      const result = await delegateController.generate(req.body, req.app.db);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
  }
);

/**
 * Use a delegation token.
 */
router.post(
    '/use',
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({
          status: 'failed',
          message: 'Some parameters were invalid',
          errors: errors.array()
        });
      } else {
        const result = await delegateController.use(req.body, req.app.db);
        const status = result.status === 'success' ? 200 : 400;
        res.status(status).json(result);
      }
    }
);
module.exports = router;
