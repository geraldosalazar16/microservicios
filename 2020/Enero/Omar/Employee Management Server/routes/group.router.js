const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const group_controller = require('../controllers/group.controller');


router.post('/create', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('title').exists().withMessage('Field required {title}'),
    body('desc').exists().withMessage('Field required {desc}')
], group_controller.create);


router.post('/edit', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('group_id').exists().withMessage('Field required {group_id}'),
    body('bid').exists().withMessage('Field required {bid}'),
    body('title').exists().withMessage('Field required {title}'),
    body('desc').exists().withMessage('Field required {desc}')
], group_controller.edit);


router.post('/delete', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('group_id').exists().withMessage('Field required {group_id}'),
    body('bid').exists().withMessage('Field required {bid}')
], group_controller.delete);


router.post('/list', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('bid').exists().withMessage('Field required {bid}')
], group_controller.list);


module.exports = router;