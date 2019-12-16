const express = require('express');
const router = express.Router();

const role_controller = require('../controllers/role.controller');

router.post('/create', role_controller.create);
router.post('/edit', role_controller.edit);
router.post('/delete', role_controller.delete);
router.post('/list', role_controller.list);
module.exports = router;