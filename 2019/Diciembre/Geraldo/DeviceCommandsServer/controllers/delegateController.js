const Authorization = require('../libs/Authorization');
const ActionTokens = require('../libs/ActionTokens');
const commandsDb = require('../models/commandModel');
const historyDb = require('../models/usageHistoryModel');
const { failure } = require('../utils/response');
const {sendMessages} = require('../kafka');

/**
 * Generate a delegated command.
 * @param {Object} data Data from request
 * @param {Object} bd mongodb db object
 * @returns List of all commands
 */
exports.generate = async (data, db) => {
  const {
    user_id,
    code,
    args,
    target,
    list,
    limited,
    limit,
    life,
    target_type,
    target_list,
    carrier_type,
    carrier_list,
  } = data;
  try {
    // Authorize
    const authorized = await Authorization.authorize('commands/delegation/generate', {
      user_id,
      code,
      args,
      target_type,
      target_list,
      carrier_type,
      carrier_list,
      limited,
      limit,
      life,
    });
    if (authorized.status === 'success') {
      // Check commands table to make sure there exists a command with same code
      const command = await commandsDb.get(code, db);
      if (!command) {
        return failure('Command not found');
      } else {
        // Create delegation token
        const atResult = await ActionTokens.createStandard(
          limited,
          limit,
          user_id,
          'delegated_command',
          {
            user_id,
            code,
            args,
            target_type,
            target_list,
            carrier_type,
            carrier_list,
            created_at: new Date()
          },
          life
        );
        const delegation_token = atResult.token;
        // Publish event on Kafka
        const message = JSON.stringify({
          user_id,
          code,
          args,
          target_type,
          target_list,
          carrier_type,
          carrier_list
        });
        await sendMessages('command_delegation_requested', message);
        return {
          status: 'success',
          delegation_token
        }
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
 * Generate a delegated command.
 * @param {Object} data Data from request
 * @param {Object} bd mongodb db object
 * @returns basic response with code, args
 */
exports.use = async (data, db) => {
  const {
    carrier_id,
    dev_id,
    dev_serial,
    delegation_token
  } = data;
  try {
    const atResult = await ActionTokens.use(dev_id, delegation_token, 'delegated_command');
    const payload = atResult.payload;
    const authorized = await Authorization.authorize('commands/delegation/allowed', {payload});
    if (authorized.status === 'success') {
      if (payload.carrier_type === 'list') {
        let mismatched_carrier = false;
        if (carrier_id) {
          const found = payload.carrier_list.some(carrier => carrier === carrier_id);
          mismatched_carrier = !found;
        } else {
          mismatched_carrier = true;
        }
        if (mismatched_carrier) {
          // Publish event on Kafka
          const message = JSON.stringify({
            type: 'mismatched_carrier',
            payload
          });
          await sendMessages('command_delegation_fraud_detected', message);
          return failure('Carrier not Authorized');
        }
      }
      if (payload.target_type === 'list') {
        const found = payload.target_list.some(target => target === dev_serial);
        if (!found) {
          // Publish event on Kafka
          const message = JSON.stringify({
            type: 'mismatched_target',
            payload
          });
          await sendMessages('command_delegation_fraud_detected', message);
          return failure('Target not Authorized');
        }
      }
      // Second round
      const authorized2 = await Authorization.authorize('commands/delegation/execute', {
        dev_id,
        dev_serial,
        payload
      });
      if (authorized2.status === 'success') {
        // Store usage_history on usage_histories table
        const usage_history = {
          code: payload.code,
          created_by: payload.code,
          created_at: payload.created_at,
          used_by: carrier_id,
          used_at: new Date(),
          dev_id,
          dev_serial,
          args: payload.args
        };
        await historyDb.insert(usage_history, db);
        // Publish event on Kafka
        const message = JSON.stringify({
          carrier_id,
          dev_id,
          dev_serial,
          payload
        });
        await sendMessages('command_delegation_execution_permitted', message);
        return {
          status: 'success',
          code: payload.code,
          args: payload.args
        };
      } else {
        // Publish event on Kafka
        const message = JSON.stringify({
          type: 'unauthorized_target',
          payload
        });
        await sendMessages('command_delegation_fraud_detected', message);
        return failure('Not Authorized');
      }
    } else {
      // Publish event on Kafka
      const message = JSON.stringify({
        type: 'unauthorized_delegator',
        payload
      });
      await sendMessages('command_delegation_fraud_detected', message);
      return failure('Invalid token');
    }
  } catch (error) {
    return failure(error);
  }
}




