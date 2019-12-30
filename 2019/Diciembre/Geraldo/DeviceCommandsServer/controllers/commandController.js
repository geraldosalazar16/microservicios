const Authorization = require('../libs/Authorization');
const PosSignal = require('../libs/PosSignal');
const commandsDb = require('../models/commandModel');
const devCommandDb = require('../models/devCommandModel');
const { success, failure } = require('../utils/response');
const {sendMessage} = require('../kafka');

/**
 * List all commands.
 * @param {Object} data Data with user_id, type. purpose
 * @param {Object} bd mongodb db object
 * @returns List of all commands
 */
exports.list = async (data, db) => {
  try {
    // Authorize
    const authorized = await Authorization.authorize('commands/list', data);
    if (authorized.status === 'success') {
      const commands = await commandsDb.list(data, db);
      return {
        status: 'success',
        commands
      }
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
 * @param {Object} db mongodb db object
 * @returns Basic response depending of the result
 */
exports.isAllowed = async (data, db) => {
  const {
    dev_type,
    dev_usage,
    dev_group_id,
    command_code
  } = data;
  try {
    // Get de dev_command
    const dev_command = await devCommandDb.get(command_code, db);
    // Check for devices
    if (dev_command && dev_command.devices) {
      const found = dev_command.devices.some(device => {
        return device.dev_type === dev_type
        && device.dev_usage === dev_usage
        && device.dev_group_id === dev_group_id
      });
      if (found) {
        return success('Device found');
      } else {
        return failure('No device found');
      }
    } else {
      return failure('No device found');
    }
  } catch (error) {
    return {
      status: 'failed',
      message: error.message
    };
  }
}

/**
 * Requests command to be sent to device.
 * @param {Object} data Data with user_id, bid, code, args, dev_id, dev_serial
 * @param {Object} bd mongodb db object
 * @returns Basic response
 */
exports.send = async (data, db) => {
  const {
    code,
    args
  } = data;
  try {
    // Authorize
    const authorized = await Authorization.authorize('commands/send', data);
    if (authorized.status === 'success') {
      await PosSignal.command(code, args);
      const message = JSON.stringify(data);
      await sendMessage('command_send_requested', message);
      return success('Command send requested');
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



