const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const client_controller = require('../controllers/client.controller');


router.post('/create', [
    body('name').exists().withMessage('Field required {name}'),
    body('title').exists().withMessage('Field required {title}'),
    body('desc').exists().withMessage('Field required {desc}')
], client_controller.create);
router.post('/delete', client_controller.delete);
router.post('/block', client_controller.block);
router.post('/unblock', client_controller.unblock);
router.post('/list', [
    body('clientId').exists().withMessage('Field required {clientId}')
], client_controller.list);

module.exports = router;