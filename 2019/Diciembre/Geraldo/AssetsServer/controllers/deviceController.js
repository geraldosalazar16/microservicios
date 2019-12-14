const { body, validationResult } = require('express-validator/check');
const Authorization = require('../libs/Authorization');

exports.validateInvite = (method) => {
  switch (method) {
    case 'inviteDevice': {
     return [ 
            body('user_id', `user_id cant't be undefined`).exists(),
            body('bid', `bid cant't be undefined`).exists(),
            body('title', `title cant't be undefined`).exists(),
            body('desc', `desc cant't be undefined`).exists(),
       ]   
    }
  }
}

exports.invite = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        const { user_id, bid, title, desc} = req.body;
        // Authorize
        const auth = new Authorization();
        auth.authorize('/asset/device/invite', {
          user_id,
          bid
        })
        res.status(200).json({
          status: 'success',
          message: 'Device invited successfully'
        });
    } catch (error) {
      res.status(400).json({
        status: 'failed',
        message: error.message
      });
    }
}