const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const clock_controller = require('../controllers/clock.controller');


router.post('/clockin', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('emp_id').exists().withMessage('Field required {emp_id}')
], clock_controller.clockin);


router.post('/clockout', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('emp_id').exists().withMessage('Field required {emp_id}')
], clock_controller.clockout);


router.post('/list', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('emp_id').exists().withMessage('Field required {emp_id}'),
    body('daterange').exists().withMessage('Field required arrays {daterange}')
], clock_controller.list);


module.exports = router;