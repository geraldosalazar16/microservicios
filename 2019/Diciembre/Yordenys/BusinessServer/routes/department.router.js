const express = require('express');
const router = express.Router();

const department_controller = require('../controllers/department.controller');

router.get('/create', department_controller.create);
router.get('/edit', department_controller.edit);
router.get('/delete', department_controller.delete);
router.get('/list', department_controller.list);
module.exports = router;