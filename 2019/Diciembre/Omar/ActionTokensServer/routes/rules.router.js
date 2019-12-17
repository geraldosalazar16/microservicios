const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const rules_controller = require('../controllers/rules.controller');

router.post('/set', rules_controller.set);
router.post('/getall', [
    body('clientId').exists().withMessage('Field required {clientId}')
], rules_controller.getall);
router.post('/delete', [
    body('clientId').exists().withMessage('Field required {clientId}'),
    body('apiId').exists().withMessage('Field required {apiId}')
], rules_controller.delete);

module.exports = router;