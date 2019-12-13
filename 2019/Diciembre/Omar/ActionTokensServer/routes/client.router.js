const express = require('express');
const router = express.Router();

const client_controller = require('../controllers/client.controller');

router.post('/create', client_controller.create);
router.post('/delete', client_controller.delete);
router.post('/block', client_controller.block);
router.post('/unblock', client_controller.unblock);

module.exports = router;