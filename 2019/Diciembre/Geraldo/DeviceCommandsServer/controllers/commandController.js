const Authorization = require('../libs/Authorization');
const { sendMessages } = require('../kafka');
const commandsDb = require('../schemas/commandSchema');
const { success, failure } = require('../utils/response');

/**
 * List all commands.
 * @param {Object} data Data with user_id, type. purpose
 * @returns List of all commands
 */
exports.list = async (data) => {
  const {
    type,
    purpose
  } = data;
  try {
    // Authorize
    const authorized = await Authorization.authorize('commands/list', data);
    if (authorized.status === 'success') {
      // Get list of commands
      return await commandsDb.list({type, purpose});
    } else {
      return failure('Not authorized');
    }
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  }
}

/**
 * Check to make sure device is allowed to execute the command.
 * @param {Object} data Data with dev_type, dev_usage, dev_group_id, command_code
 * @returns Response success or failed
 */
exports.list = async (data) => {
  const {
    type,
    purpose
  } = data;
  try {
    // Authorize
    const authorized = await Authorization.authorize('commands/list', data);
    if (authorized.status === 'success') {
      // Get list of commands
      return await commandsDb.list({type, purpose});
    } else {
      return failure('Not authorized');
    }
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  }
}

