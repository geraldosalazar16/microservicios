const Authorization = require('../libs/Authorization');
const { sendMessages } = require('../kafka');
const { success, failure } = require('../utils/response');
const policyModel = require('../models/policyModel');

exports.set = async (data) => {
  const {
    user_id,
    chid,
    policy
  } = data;
  try {
    // Authorize
    const authorized = await Authorization.authorize('blocklist_ctrl/policy/set', {
      user_id,
      chid
    });
    if (authorized.status === 'success') {
      // Store or update record in policy table
      const result = await policyModel.write(data);
      if (result.status === 'success') {
        // Push event on kafka
        const message = JSON.stringify({
          user_id,
          chid,
          policy,
          created_at: new Date()
        });
        await sendMessages('blocklist_policy_updated', message);
        return success('Policy updated');
      } else {
        return failure(result.message);
      }
    } else {
      return failure('Not authorized');
    }
  } catch (error) {
    return failure(error.message);
  }
}

exports.get = async (data) => {
  const {
    user_id,
    chid
  } = data;
  try {
    // Authorize
    const authorized = await Authorization.authorize('blocklist_ctrl/policy/get', {
      user_id,
      chid
    });
    if (authorized.status === 'success') {
      // Get record with same chid from policy table
      const result = await policyModel.get(chid);
      if (result.status === 'success') {
        return {
          status: 'success',
          policy: result.policy
        };
      } else {
        return failure(result.message);
      }
    } else {
      return failure('Not authorized');
    }
  } catch (error) {
    return failure(error.message);
  }
}
