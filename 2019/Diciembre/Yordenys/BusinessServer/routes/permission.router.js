const express = require('express');
const router = express.Router();

const permission_controller = require('../controllers/permission.controller');


router.get('/list', permission_controller.list);
module.exports = router;