const db = require('../database/api');
const config = require('../config.json');
const Aerospike = require('aerospike');
const { success, failure } = require('../utils/responses');
const uuidv4 = require('uuid/v4');
const { sendMessages } = require('../kafka');
const op = Aerospike.operations;
const Authorization = require('../libs/Authorization');

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
            const newName = `${bid}.${type}.${purpose}.${attrib || ""}`
            const key = new Aerospike.Key(config.aerospike.namespace, 'sig_channels', newName);
            const channel = await db.readRecord(key);
            if (channel.status === 'success') {
                return {
                    status: 'success',
                    message: 'Channel found',
                    channel: channel.data.bins.name
                }
            } else {
                // Store new channel
                const newChannel = {
                    name: newName,
                    bid,
                    type,
                    purpose,
                    attrib
                };
                const storeInDbResult = await db.writeRecord(
                    config.aerospike.namespace,
                    'sig_channels',
                    newName,
                    newChannel
                );
                if (storeInDbResult.status === 'success') {
                    // Publish to kafka
                    const kafkaMessage = JSON.stringify(Object.assign(channel, { created_at: new Date() }));
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

