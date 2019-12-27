const Authorization = require('../libs/Authorization');
const { sendMessages } = require('../kafka');
const { success, failure } = require('../utils/response');
const blacklistModel = require('../models/blacklistModel');

exports.add = async (data) => {
    const {
        user_id,
        chid,
        peer_id,
        temporary,
        till
    } = data;
    try {
        // Authorize
        const authorized = await Authorization.authorize('blocklist_ctrl/blacklist/add', {
            user_id,
            chid,
            peer_id
        });
        if (authorized.status === 'success') {
            // Store new record in black_peers table
            const result = await blacklistModel.add(data);
            if (result.status === 'success') {
                // Push event on kafka
                const message = JSON.stringify({
                    user_id,
                    chid,
                    peer_id,
                    temporary,
                    till,
                    created_at: new Date()
                });
                await sendMessages('blocklist_added_to_blacklist', message);
                return success('Blacklist added');
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
    const {
        user_id,
        chid,
        peer_id
    } = data;
    try {
        // Authorize
        const authorized = await Authorization.authorize('blocklist_ctrl/blacklist/remove', {
            user_id,
            chid,
            peer_id
        });
        if (authorized.status === 'success') {
            // Remove record from black_peers table with same chid and peer_id
            const result = await blacklistModel.remove(data);
            if (result.status === 'success') {
                // Push event on kafka
                const message = JSON.stringify({
                    user_id,
                    chid,
                    peer_id,
                    created_at: new Date()
                });
                await sendMessages('blocklist_removed_from_blacklist', message);
                return success('Blacklist removed');
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
        const authorized = await Authorization.authorize('blocklist_ctrl/blacklist/list', {
            user_id,
            chid
        });
        if (authorized.status === 'success') {
            // List all records from table black_peers with same chid
            return await blacklistModel.list({chid});
        } else {
            return failure('Not authorized');
        }
    } catch (error) {
        return failure(error.message);
    }
}
