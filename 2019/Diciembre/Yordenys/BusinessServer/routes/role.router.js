const express = require('express');
const router = express.Router();

const role_controller = require('../controllers/role.controller');

router.get('/create', role_controller.create);
router.get('/edit', role_controller.edit);
router.get('/delete', role_controller.delete);
router.get('/list', role_controller.list);
module.exports = router;