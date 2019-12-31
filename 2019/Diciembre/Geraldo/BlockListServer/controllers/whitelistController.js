const Authorization = require('../libs/Authorization');
const { sendMessages } = require('../kafka');
const { success, failure } = require('../utils/response');
const whitelistModel = require('../models/whitelistModel');

exports.add = async (data) => {
    const {
        user_id,
        chid,
        peer_id
    } = data;
    try {
        // Authorize
        const authorized = await Authorization.authorize('blocklist_ctrl/whitelist/add', {
            user_id,
            chid,
            peer_id
        });
        if (authorized.status === 'success') {
            // Store new record in white_peers table
            const result = await whitelistModel.add(data);
            if (result.status === 'success') {
                // Push event on kafka
                const message = JSON.stringify({
                    user_id,
                    chid,
                    peer_id,
                    created_at: new Date()
                });
                // await sendMessages('blocklist_added_to_whitelist', message);
                return success('Whitelist added');
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

exports.remove = async (data) => {
    try {
        // Authorize
        const authorized = await Authorization.authorize('blocklist_ctrl/whitelist/remove', data);
        if (authorized.status === 'success') {
            // Remove record from white_peers table with same chid and peer_id
            const result = await whitelistModel.remove(data);
            if (result.status === 'success') {
                // Push event on kafka
                const message = JSON.stringify({
                    created_at: new Date(),
                    ...data
                });
                await sendMessages('blocklist_removed_from_whitelist', message);
                return success('whitelist removed');
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

exports.list = async ({user_id, chid}) => {
    try {
        // Authorize
        const authorized = await Authorization.authorize('blocklist_ctrl/whitelist/list', {
            user_id,
            chid
        });
        if (authorized.status === 'success') {
            // List all records from table white_peers with same chid
            return await whitelistModel.list({chid});
        } else {
            return failure('Not authorized');
        }
    } catch (error) {
        return failure(error.message);
    }
}
