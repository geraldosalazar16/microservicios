const { body, validationResult } = require('express-validator');
const Authorization = require('../libs/Authorization');
const ActionTokens = require('../libs/ActionTokens');
const { sendMessages } = require('../kafka');

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

exports.invite = async ({ user_id, bid, title, desc }) => {
  try {
    // Authorize
    const auth = new Authorization();
    const authorized = auth.authorize('/asset/device/invite', {
      user_id,
      bid
    });
    if (authorized) {
      // Get invitation code
      const at = new ActionTokens();
      const invitationCode = at.createAlphanumeric(
        true,
        1,
        user_id,
        'asset_device_invite',
        'added_to_business',
        {
          by: user_id,
          bid: bid,
          title: title,
          desc: desc
        },
        600000
      );
      // Push to Kafka
      const message = {
        user_id,
        bid,
        created_at: new Date().toString()
      };
      const messageResult = await sendMessages('test', JSON.stringify(message));
      return {
        status: 'success',
        message: 'Device invited successfully',
        invitationCode
      };
    } else {
      return {
        status: 'failed',
        message: 'Not authorized'
      };
    }
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  }
}