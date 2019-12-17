const db = require('../database/api');
const config = require('../config.json');
const Aerospike = require('aerospike');
const { success, failure } = require('../utils/responses');
const uuidv4 = require('uuid/v4');
const { sendMessages } = require('../kafka');
const op = Aerospike.operations;
const table = 'quantities';

/**
 * 
 * @param {String} bid 
 * @param {String} reference 
 * @param {String} value 
 */
exports.set = ({bid, reference, value}) => {
    try {
        // Check quantities table to make sure no other item with same reference exists
        var scan = client.scan(config.aerospike.namespace, table);
        scan.concurrent = true
        scan.nobins = false
        const stream = scan.foreach();
        const filter = [
            reference
        ];
        const result = db.fetchRecordsFromStream(stream, filter);
        const quantity = result.records[0];
        if (result.records.length > 0) {
            // Update value of Item to new value
            const ops = [
                op.write('value', value)
            ];
            await db.updateRecord(quantity.key, ops);
        } else {
            // Create new quantity in quantities table.
            const newQuantity = {
                bid,
                reference,
                value
            }
            await db.writeRecord(config.aerospike.namespace, table, uuidv4(), newQuantity);
        }
        // Store new change_history in change_histories table
        const change_history = {
            reference,
            new_val: value,
            change: value,
            forced: 'true',
            at: new Date()
        }
        db.writeRecord(config.aerospike.namespace, 'change_history', uuidv4(), change_history);
        // Publish event on Kafka
        const message = JSON.stringuify({
            reference,
            bid,
            value,
            created_at: new Date()
        });
        await sendMessages('quantity_set', message);
        return success('Quantity value set');
    } catch (error) {
        return failure(error.message);
    }
    
}

/**
 * 
 * @param {String} bid 
 * @param {String} reference 
 * @param {Number} amount 
 */
const update = ({bid, reference, amount}) => {

}