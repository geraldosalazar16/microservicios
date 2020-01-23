const Aerospike = require('aerospike');
const { aerospikeConfig } = require('./config');
const { success, failure } = require('../utils/responses');
const client = Aerospike.client(aerospikeConfig());

/**
 * Connect to the database. This method must be called first
 * https://www.aerospike.com/docs/client/nodejs/examples/node_express_aerospike.html
 */
exports.connect = async () => {
    try {
        await client.connect();
        return {
            status: 'success',
        };
    } catch (error) {
        return failure(error.message);
    }
}

exports.client = client;

/**
 * Read a record from the database
 * https://www.aerospike.com/docs/client/nodejs/usage/kvs/read.html
 * @param {Object} key 
 * @returns {Object} Record
 */
exports.readRecord = async (key) => {
    try {
        const record = await client.get(key);
        return success('Record fetched', record);
    } catch (error) {
        return failure(error.message);
    }
}

/**
 * Write a record to the database
 * @param {Object} dataPath 
 * @param {Object} bins 
 */
exports.writeRecord = async (namespace, set, key, bins) => {
    const aerospikeKey = new Aerospike.Key(namespace, set, key);
    try {
        // Put the record to the database.
        await client.put(aerospikeKey, bins);
        return success('Record added successfully');
    } catch (error) {
        return failure(error.message);
    }
}

/**
 * Scan a stream to return the records
 * @param {Object} stream 
 * @param {Array} filter An array of fields to include
 * @returns {Object} Records and errors
 */
exports.fetchRecordsFromStream = (stream, filter = []) => {
    return new Promise((resolve, reject) => {
        // Store the records
        const records = [];
        // Store errors
        const errors = [];
        stream.on('data', function (record) {
            // If received a filter option, only show included fields
            if (filter) {
                let equal = true;
                Object.keys(filter).forEach(field => {
                    if (record.bins[field] !== filter[field]) {
                        equal = false;
                    }
                });
                if (equal) {
                    records.push(record);
                }
            } else {
                records.push(record);
            }
        })
        stream.on('error', function (error) {
            errors.push(`Error while scanning: ${error.message} [${error.code}]`);
        });
        stream.on('end', function () {
            resolve(success('Records fetched ', records, errors));
        });
    });
}

/**
 * Deletes a record form the database
 * @param {String} key 
 */
exports.deleteRecord = async (key) => {
    try {
        await client.remove(key);
        return success('Record deleted successfully');
    } catch (error) {
        return failure(error.message);
    }
}

/**
 * Check if a record exist
 * @param {String} key 
 */
exports.existRecord = async (key) => {
    try {
        const result = await client.exist(key);
        if (result) {
            return success('Match found');
        } else {
            return failure('No match found');
        } 
    } catch (error) {
        return failure(error.message);
    }
}

/**
 * Update a record in the database
 * @param {Object} key 
 * @param {Object} ops Operations to perform (usually write)
 */
exports.updateRecord = async (key, ops) => {
    try {
        const result = await client.operate(key, ops);
        if (result) {
            return success('Record updated');
        } else {
            return failure('No record found');
        } 
    } catch (error) {
        return failure(error.message);
    }
}
