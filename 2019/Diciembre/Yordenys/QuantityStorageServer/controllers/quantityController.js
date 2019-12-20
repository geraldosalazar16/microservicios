const db = require('../database/api');
const config = require('../config.json');
const Aerospike = require('aerospike');
const { success, failure } = require('../utils/responses');
const uuidv4 = require('uuid/v4');
const { sendMessages } = require('../kafka');
const op = Aerospike.operations;
const table = 'quantities';

exports.set = async ({ bid, reference, value }) => {
    try {
        // Search for quantity
        const result = await findQuantity(reference);
        const quantity = result.data;
        if (result.status === 'success') {
            // Update value of Item to new value
            const ops = [
                op.write('value', parseFloat(value))
            ];
            await db.updateRecord(quantity.key, ops);
        } else {
            // Create new quantity in quantities table.
            const newQuantity = {
                bid: bid.toString(),
                reference: reference.toString(),
                value: parseFloat(value)
            };
            await db.writeRecord(config.aerospike.namespace, table, reference, newQuantity);
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
        const message = JSON.stringify({
            reference,
            bid,
            value: parseFloat(value),
            created_at: new Date()
        });
        await sendMessages('quantity_set', message);
        return success('Quantity value set');
    } catch (error) {
        return failure(error.message);
    }

}

exports.update = async ({ bid, reference, amount }) => {
    try {
        // Search for quantity
        const result = await findQuantity(reference);
        const quantity = result.data;
        if (result.status === 'success') {
            const newValue = quantity.bins.value + parseFloat(amount);
            // Update amount
            const ops = [
                op.write('value', newValue)
            ];
            await db.updateRecord(quantity.key, ops);
            // Store new change_history in change_histories table
            const change_history = {
                reference,
                new_val: newValue,
                change: amount,
                forced: 'false',
                at: new Date()
            }
            db.writeRecord(config.aerospike.namespace, 'change_history', uuidv4(), change_history);
            // Publish event on Kafka
            const message = JSON.stringify({
                reference,
                bid,
                new_val: newValue,
                created_at: new Date()
            });
            await sendMessages('quantity_updated', message);
            return success('Quantity value updated');
        } else {
            return failure('No quantity exist with this reference');
        }
    } catch (error) {
        return failure(error.message);
    }
}

exports.get = async ({ bid, reference}) => {
    const result = await findQuantity(reference);
    const record = result.data;
    if (result.status === 'success') {
        return {
            status: 'success',
            message: 'Success',
            quantity: {
                reference,
                bid,
                value: record.bins.value
            }
        };
    } else {
        return failure('No quantity exist with this reference');
    }
}

exports.batchSet = async (quantities) => {
    const errors = [];
    const results = [];
    for (let index = 0; index < quantities.length; index++) {
        const quantity = quantities[index];
        const {bid, reference, value} = quantity;
        try {
            const result = await findQuantity(reference);
            const record = result.data;
            if (result.status === 'success') {
                // Update value of Item to new value
                const ops = [
                    op.write('value', parseFloat(value))
                ];
                await db.updateRecord(quantity.key, ops);
            } else {
                // Create new quantity in quantities table.
                const newQuantity = {
                    bid: bid.toString(),
                    reference: reference.toString(),
                    value: parseFloat(value)
                };
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
            const message = JSON.stringify({
                reference,
                bid,
                value,
                created_at: new Date()
            });
            await sendMessages('quantity_set', message);
            results.push(`Reference ${reference} set successfully`);
        } catch (error) {
            errors.push(`Error setting reference ${reference}: ${error.message}`);
        }
    }

    const finalMessage = errors.length > 0 ? 'Operation with errors' : 'Successfull operation';
    return {
        status: 'success',
        message: finalMessage,
        results,
        errors
    };
}

exports.batchUpdate = async (quantities) => {
    const errors = [];
    const results = [];
    for (let index = 0; index < quantities.length; index++) {
        const quantity = quantities[index];
        const {bid, reference, amount} = quantity;
        try {
            const result = await findQuantity(reference);
            const record = result.data;
            if (result.status === 'success') {
                const newValue = record.bins.value + parseFloat(amount);
                // Update amount
                const ops = [
                    op.write('value', newValue)
                ];
                await db.updateRecord(record.key, ops);
                // Store new change_history in change_histories table
                const change_history = {
                    reference,
                    new_val: newValue,
                    change: amount,
                    forced: 'false',
                    at: new Date()
                }
                db.writeRecord(config.aerospike.namespace, 'change_history', uuidv4(), change_history);
                // Publish event on Kafka
                const message = JSON.stringify({
                    reference,
                    bid,
                    new_val: newValue,
                    created_at: new Date()
                });
                await sendMessages('quantity_updated', message);
                results.push(`Reference ${reference} updated successfully`);
            } else {
                errors.push(`Error setting reference ${reference}: No quantity exist with this reference`);
            }
        } catch (error) {
            errors.push(`Error updating reference ${reference}: ${error.message}`);
        }
    }

    const finalMessage = errors.length > 0 ? 'Operation with errors' : 'Successfull operation';
    return {
        status: 'success',
        message: finalMessage,
        results,
        errors
    };
}

const findQuantity = async (reference) => {
    const key = new Aerospike.Key(config.aerospike.namespace, 'quantities', reference);
    const quantity = await db.readRecord(key);
    return quantity;
}