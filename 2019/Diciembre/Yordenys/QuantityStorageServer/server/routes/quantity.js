var express = require('express');
var router = express.Router();

router.post('/set', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/update', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/get', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/batchSet', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/batchUpdate', function(req, res, next) {
  res.send('respond with a resource');
});



module.exports = router;
