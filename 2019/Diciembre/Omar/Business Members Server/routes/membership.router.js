const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const membership_controller = require('../controllers/membership.controller');


router.post('/invite', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('dep_id').exists().withMessage('Field required {dep_id}'),
    body('role_id').exists().withMessage('Field required {role_id}')
], membership_controller.invite);

router.post('/join', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('invitation_code').exists().withMessage('Field required {invitation_code}')
], membership_controller.join);

router.post('/revoke', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('target_user').exists().withMessage('Field required {target_user}')
], membership_controller.revoke);

router.post('/leave', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}')
], membership_controller.leave);

router.post('/list', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}')
], membership_controller.list);

router.post('/getrole', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}')
], membership_controller.getrole);

router.post('/getpermissions', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}')
], membership_controller.getpermissions);

router.post('/getdepartment', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}')
], membership_controller.getdepartment);

router.post('/userHasPermission', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('permission').exists().withMessage('Field required {permission}')
], membership_controller.userHasPermission);

router.post('/isowner', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}')
], membership_controller.isowner);

module.exports = router;