const express = require('express');
const router = express.Router();

const department_controller = require('../controllers/department.controller');

router.post('/create', department_controller.create);
router.post('/edit', department_controller.edit);
router.post('/delete', department_controller.delete);
router.post('/list', department_controller.list);
module.exports = router;