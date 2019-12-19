const db = require('../database');

exports.quantity_set = async (payload) => {
    payload = JSON.parse(payload.value);
    console.log({
        Reference: payload.reference,
        Bid: payload.bid,
        Value: payload.value,
        Created_at: payload.created_at
    });
    const quantity = {
        reference: payload.refrence,
        value: payload.value
    }
    try {        
        await db.add('quantity', quantity, ['reference']);
        console.log('Quantity set');
    } catch (error) {
        console.log(error);
    }
}

exports.quantity_updated = async (payload) => {
    payload = JSON.parse(payload.value);
    console.log({
        Reference: payload.reference,
        Bid: payload.bid,
        New_Value: payload.new_val,
        Amount: payload.amount,
        Created_at: payload.created_at
    });
    const quantity = {
        reference: payload.refrence,
        value: payload.value
    }
    try {        
        await db.add('quantity', quantity, ['reference']);
        console.log('Quantity update');
    } catch (error) {
        console.log(error);
    }
}