var express = require('express');
var router = express.Router();
const deviceController = require('../controllers/deviceController');

/**
 * Request to invite some other device to this business.
 */
router.post(
  '/invite',
  deviceController.validateInvite('invite'),
  deviceController.invite
);

/**
 * Join via invitation code.
 */
router.post('/join', function(req, res, next) {

});

/**
 * Request to revoke a device from business assets list.
 */
router.post('/revoke', function(req, res, next) {

});

/**
 * Request to leave the position in system.
 */
router.post('/leave', function(req, res, next) {

});

/**
 * List members of a business.
 */
router.post('/list', function(req, res, next) {

});

module.exports = router;
