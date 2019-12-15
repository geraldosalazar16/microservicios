const express = require('express');
const router = express.Router();

const membership_controller = require('../controllers/membership.controller');


router.post('/invite', membership_controller.invite);
router.post('/join', membership_controller.join);
router.post('/revoke', membership_controller.revoke);
router.post('/leave', membership_controller.leave);
router.post('/list', membership_controller.list);
router.post('/getrole', membership_controller.getrole);
router.post('/getpermissions', membership_controller.getpermissions);
router.post('/getdepartment', membership_controller.getdepartment);
router.post('/userHasPermission', membership_controller.userHasPermission);
router.post('/isowner', membership_controller.isowner);

module.exports = router;