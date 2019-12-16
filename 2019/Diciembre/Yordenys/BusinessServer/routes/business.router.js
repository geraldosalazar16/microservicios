const express = require('express');
const router = express.Router();

const business_controller = require('../controllers/business.controller');

router.post('/create', business_controller.create);
router.get('/create', business_controller.create);
router.post('/edit', business_controller.edit);
router.post('/delete', business_controller.delete);

module.exports = router;