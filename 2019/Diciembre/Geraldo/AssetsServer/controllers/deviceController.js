const Authorization = require('../libs/Authorization');
const ActionTokens = require('../libs/ActionTokens');
const { sendMessages } = require('../kafka');
const {
  createDevice,
  findDevice,
  revokeDevice,
  leaveDevice,
  listDevice
} = require('../schemas/deviceSchema');

exports.invite = async ({ user_id, bid, title, desc }) => {
  try {
    // Authorize
    const auth = new Authorization();
    const authorized = await auth.authorize('/asset/device/invite', {
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
      const messageResult = await sendMessages('asset_device_invite_created', JSON.stringify(message));
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

exports.join = async ({ dev_id, dev_serial, invitation_code }) => {
  try {
    // Authorize
    const auth = new Authorization();
    const authorized = await auth.authorize('/asset/device/join', {
      dev_id,
      dev_serial
    });
    if (authorized) {
      // Get invitation code
      const at = new ActionTokens();
      const useTokenResult = at.use(
        dev_id,
        invitation_code,
        'asset_device_invite',
      );

      if (useTokenResult.status === 'success') {
        const payload = useTokenResult.payload;
        const device = {
          bid: payload.bid,
          dev_id,
          dev_serial,
          added_by: payload.by,
          added_at: new Date(),
          temporary: false,
          revoked: false,
          title: payload.title,
          desc: payload.desc
        };
        // Validate if the device is member already
        const found = await findDevice(device);
        if (!found.doc) {
          await createDevice(device);
          // Push to Kafka
          const message = {
            dev_id,
            dev_serial,
            invitation_code,
            bid: payload.bid,
            by: payload.by,
            title: payload.title,
            desc: payload.desc,
            current_time: new Date().toString()
          };
          const messageResult = await sendMessages('asset_device_join_done', JSON.stringify(message));
          return {
            status: 'success',
            message: 'Device joined'
          };
        } else {
          return {
            status: 'failed',
            message: 'Device is a member already'
          };
        }
      } else {
        // Push to Kafka
        const message = {
          user_id,
          invitation_code,
          current_time: new Date().toString()
        };
        const messageResult = await sendMessages('asset_device_join_failed', JSON.stringify(message));
        return {
          status: 'failed',
          message: 'Failed to join to the business'
        };
      }
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

exports.revoke = async ({ user_id, bid, target_dev_id }) => {
  try {
    // Authorize
    const auth = new Authorization();
    const authorized = await auth.authorize('/asset/device/revoke', {
      user_id,
      bid,
      target: target_dev_id
    });
    if (authorized) {
      // Delete from devices
      const revokeResult = await revokeDevice({ target_dev_id, bid });
      if (revokeResult.status === 'success') {
        // Push to Kafka
        const message = {
          user_id,
          target_dev_id,
          bid,
          created_at: new Date().toString()
        };
        const messageResult = await sendMessages('asset_device_revoked', JSON.stringify(message));
        return {
          status: 'success',
          message: 'Device revoked'
        };
      } else {
        return {
          status: 'failed',
          message: revokeResult.message
        };
      }
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

exports.leave = async ({ dev_id, dev_serial, bid }) => {
  try {
    // Authorize
    const auth = new Authorization();
    const authorized = await auth.authorize('/asset/device/leave', {
      dev_id,
      dev_serial,
      bid
    });
    if (authorized) {
      // Delete from devices
      const leaveResult = await leaveDevice({
        dev_id,
        dev_serial,
        bid
      });
      if (leaveResult.status === 'success') {
        // Push to Kafka
        const message = {
          dev_id,
          dev_serial,
          bid,
          created_at: new Date().toString()
        };
        const messageResult = await sendMessages('asset_device_left_business', JSON.stringify(message));
        return {
          status: 'success',
          message: 'Device leaved'
        };
      } else {
        return {
          status: 'failed',
          message: leaveResult.message
        };
      }
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

exports.list = async ({ user_id, bid }) => {
  try {
    // Authorize
    const auth = new Authorization();
    const authorized = await auth.authorize('/asset/device/list', {
      user_id,
      bid
    });
    if (authorized) {
      // Delete from devices
      const listResult = await listDevice({bid});
      if (listResult.status === 'success') {
        return {
          status: 'success',
          message: 'Device leaved'
        };
      } else {
        return {
          status: 'failed',
          message: listResult.message,
          data: listResult.docs
        };
      }
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