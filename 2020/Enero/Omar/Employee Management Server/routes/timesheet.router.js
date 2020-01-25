const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const timesheet_controller = require('../controllers/timesheet.controller');


router.post('/create', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('group_id').exists().withMessage('Field required {group_id}'),
    body('title').exists().withMessage('Field required {title}'),
    body('desc').exists().withMessage('Field required {desc}'),
    body('time_range').exists().withMessage('Array required {time_range}')
], timesheet_controller.create);


router.post('/edit', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('group_id').exists().withMessage('Field required {group_id}'),
    body('sheet_id').exists().withMessage('Field required {sheet_id}'),
    body('title').exists().withMessage('Field required {title}'),
    body('desc').exists().withMessage('Field required {desc}'),
    body('time_range').exists().withMessage('Array required {time_range}')
], timesheet_controller.edit);


router.post('/delete', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('sheet_id').exists().withMessage('Field required {sheet_id}')
], timesheet_controller.delete);


module.exports = router;