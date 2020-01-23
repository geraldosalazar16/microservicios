const Authorization = require('../libs/Authorization');
const { sendMessages } = require('../kafka');
const { success, failure } = require('../utils/response');
const db = require('../database');

exports.pub = async ({ user_id, bid, dev_id, dev_serial, name }) => {
  try {
    // Authorize
    const authorized = await Authorization.authorize('signal/core/publish', {
      user_id,
      dev_id,
      dev_serial,
      bid,
      name
    });
    if (authorized.status === 'success') {
      return success('Authorized');
    } else {
      return failure('Not authorized');
    }
  } catch (error) {
    return failure(error.message);
  }
}

exports.sub = async (data) => {
  const { user_id, bid, dev_id, dev_serial, name } = data;
  try {
    // Authorize
    const authorized = await Authorization.authorize('signal/core/publish', data);
    if (authorized.status === 'success') {
      const member_id = user_id ? user_id : dev_id;
      const memberWithId = JSON.stringify({
        member_id,
        channel_name: name,
        connected_at: new Date(),
        last_signal: new Date()
      });
      const result = await db.add('members', memberWithId, ['member_id']);
      if (result.status === 'success') {
        // Publish event on Kafka
        const message = Object.assign({}, data, {created_at: new Date()});
        await sendMessages('signal_core_sub_permitted', message)
        return success('Member added');
      } else {
        return failure(result.error);
      }
    } else {
      return failure('Not authorized');
    }
  } catch (error) {
    return failure(error.message);
  }
}