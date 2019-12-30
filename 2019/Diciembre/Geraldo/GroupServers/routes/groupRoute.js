var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
group = require('../controllers/groupController')

/* POST create new group. */
router.post(
  '/create',
  [
    body('user_id', `user_id can't be undefined`).exists(),
    body('name', `name can't be undefined`).exists(),
    body('title', `title can't be undefined`).exists(),
    body('desc', `desc can't be undefined`).exists()
  ],
   async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(422).json({
        status: 'failed',
        message: 'Some parameters were invalid',
        errors: errors.array()
      });
    } else{
      const result = await group.create(req.body, req.app.db);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
    
});
/* POST delete group. */
router.post(
  '/delete',
  [
    body('user_id', `user_id can't be undefined`).exists(),
    body('name', `name can't be undefined`).exists()
  ],
   async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(422).json({
        status: 'failed',
        message: 'Some parameters were invalid',
        errors: errors.array()
      });
    } else{
      const result = await group.delete(req.body,req.app.db);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
    
});
/* POST list members of a group. */
router.post(
  '/list',
  [
    body('user_id', `user_id can't be undefined`).exists(),
    body('name', `name can't be undefined`).exists()
  ],
   async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(422).json({
        status: 'failed',
        message: 'Some parameters were invalid',
        errors: errors.array()
      });
    } else{
      const result = await group.list(req.body,req.app.db);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
    
});
/* POST Join to a group. */
router.post(
  '/join',
  [
    body('user_id', `user_id can't be undefined`).exists(),
    body('name', `name can't be undefined`).exists()
  ],
   async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(422).json({
        status: 'failed',
        message: 'Some parameters were invalid',
        errors: errors.array()
      });
    } else{
      const result = await group.join(req.body,req.app.db);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
    
});

/* POST Update role of user. */
router.post(
  '/updateRole',
  [
    body('user_id', `user_id can't be undefined`).exists(),
    body('name', `name can't be undefined`).exists(),
    body('peer_id', `peer_id can't be undefined`).exists(),
    body('role_id', `role_id can't be undefined`).exists()
  ],
   async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(422).json({
        status: 'failed',
        message: 'Some parameters were invalid',
        errors: errors.array()
      });
    } else{
      const result = await group.updateRole(req.body,req.app.db);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
    
});

/* POST Update a group. */
router.post(
  '/edit',
  [
    body('user_id', `user_id can't be undefined`).exists(),
    body('name', `name can't be undefined`).exists(),
    body('title', `title can't be undefined`).exists(),
    body('desc', `desc can't be undefined`).exists()
  ],
   async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(422).json({
        status: 'failed',
        message: 'Some parameters were invalid',
        errors: errors.array()
      });
    } else{
      const result = await group.editGroup(req.body,req.app.db);
      const status = result.status === 'success' ? 200 : 400;
      res.status(status).json(result);
    }
    
});
module.exports = router;