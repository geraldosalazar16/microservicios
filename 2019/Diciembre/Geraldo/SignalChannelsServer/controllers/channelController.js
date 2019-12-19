const db = require('../database/api');
const config = require('../config.json');
const Aerospike = require('aerospike');
const { success, failure } = require('../utils/responses');
const uuidv4 = require('uuid/v4');
const { sendMessages } = require('../kafka');
const op = Aerospike.operations;

exports.request = async (channel) => {
    const {
        user_id,
        bid,
        dev_id,
        dev_serial,
        type,
        purpose,
        attrib
    } = channel;
    try {
        // Authorize
        const authorized = await Authorization.authorize('/signal_channel/request', channel);
        if (authorized.status === 'success') {
            // Search for the channel
            var scan = db.client.scan(config.aerospike.namespace, 'sig_channels');
            scan.concurrent = true
            scan.nobins = false
            const stream = scan.foreach();
            const filter = {
                bid,
                type,
                purpose,
                attrib
            };
            const searchChannelResult = await db.fetchRecordsFromStream(stream, filter);
            if (searchChannelResult.status === 'success') {
                const channel = searchChannelResult.data[0];
                return {
                    status: 'success',
                    message: 'Channel found',
                    channel: channel.name
                }
            } else {
                // Store new channel
                const newChannel = {
                    name: `${bid}.${type}.${purpose}.${attrib || ""}`,
                    bid,
                    type,
                    purpose,
                    attrib
                };
                const storeInDbResult = await db.writeRecord(
                    config.aerospike.namespace,
                    'sig_channels',
                    uuidv4(),
                    newChannel
                );
                if (storeInDbResult.status === 'success') {
                    // Publish to kafka
                    const kafkaMessage = JSON.stringify(Object.assign(channel, {created_at: new Date()}));
                    await sendMessages('signal_channel_created', kafkaMessage);
                    return {
                        status: 'success',
                        message: 'Signal Channel created',
                        channel: newChannel.name
                    };
                } else {
                    return failure(storeInDbResult.message || 'There was an error while storing the channel to the datbase');
                }
            }   
        } else {
            return failure('Not authorized');
        }
    } catch (error) {
        return failure(error.message);
    }
}

exports.isPubAllowed = async (data) => {
    try {
        // Authorize
        return await Authorization.authorize('/signal_channel/publish', data);
    } catch (error) {
        return failure(error.message);
    }
}

exports.isPubAllowed = async (data) => {
    try {
        // Authorize
        return await Authorization.authorize('/signal_channel/subscribe', data);
    } catch (error) {
        return failure(error.message);
    }
}

