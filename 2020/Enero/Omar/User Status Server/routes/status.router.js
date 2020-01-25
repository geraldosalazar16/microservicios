const express = require('express');
const {body} = require('express-validator');
const router = express.Router();

const status_controller = require('../controllers/status.controller');


router.post('/setstate', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('state').exists().withMessage('Field required {state}')
], status_controller.setstate);


router.post('/getstate', [
    body('user_id').exists().withMessage('Field required {user_id}')
], status_controller.getstate);


router.post('/setstatus', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('status').exists().withMessage('Field required {status}')
], status_controller.setstatus);


router.post('/getstatus', [
    body('user_id').exists().withMessage('Field required {user_id}')
], status_controller.getstatus);


router.post('/setlastseen', [
    body('user_id').exists().withMessage('Field required {user_id}'),
    body('lastseen').exists().isISO8601().withMessage('Field required {lastseen}')
], status_controller.setlastseen);


router.post('/getlastseen', [
    body('user_id').exists().withMessage('Field required {user_id}')
], status_controller.getlastseen);


module.exports = router;