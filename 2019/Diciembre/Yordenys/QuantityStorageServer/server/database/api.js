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

/**
 * Read a record from the database
 * https://www.aerospike.com/docs/client/nodejs/usage/kvs/read.html
 * @param {Object} key 
 * @returns {Object} Record
 */
exports.readRecord = (key) => {
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
exports.writeRecord = ({namespace, set, key}, bins) => {
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
            if (FileReader.length > 0) {
                const filteredRecord = {};
                filter.foreach(field => {
                    filteredRecord[field] = record[field];
                });
                records.push(filteredRecord);
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
exports.deleteRecord = (key) => {
    try {
        await client.remove(key);
        return success('Record deleted successfully');
    } catch (error) {
        return failure(error.message);
    }
}

