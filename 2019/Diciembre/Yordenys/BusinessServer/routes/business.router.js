const express = require('express');
const router = express.Router();

const business_controller = require('../controllers/business.controller');

router.get('/create', business_controller.create);
router.get('/create', business_controller.create);
router.get('/edit', business_controller.edit);
router.get('/delete', business_controller.delete);

module.exports = router;