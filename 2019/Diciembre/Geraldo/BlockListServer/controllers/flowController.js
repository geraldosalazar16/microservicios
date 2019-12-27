const Authorization = require('../libs/Authorization');
const { success, failure } = require('../utils/response');
const policyModel = require('../models/policyModel');
const whitelistModel = require('../models/whitelistModel');
const blacklistModel = require('../models/blacklistModel');

exports.isContactAllowed = async (data) => {
    const {
        chid
    } = data;
    try {
        // Authorize
        const authorized = await Authorization.authorize('blocklist_ctrl/flow/isContactAllowed', data);
        if (authorized.status === 'success') {
            // Get channel_policy from policy table using chid
            const result = await policyModel.get(chid);
            if (result.status === 'success') {
                const channel_policy = result.policy;
                if (channel_policy === 'whitelist') {
                    // Check record with same peer_id=user_id, chid=chid exists in white_peers table
                    return await whitelistModel.check(data);
                } else if (channel_policy === 'blacklist') {
                    // Check record with same peer_id=user_id, chid=chid exists in black_peers table
                    return await blacklistModel.check(data)
                }
                // Default case
                return {
                    status: 'failed',
                    message: 'Not Allowed'
                }
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

