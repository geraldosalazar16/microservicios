const express = require('express');
const router = express.Router();

const rules_controller = require('../controllers/rules.controller');

router.post('/set', rules_controller.set);
router.post('/getall', rules_controller.getall);
router.post('/delete', rules_controller.delete);

module.exports = router;