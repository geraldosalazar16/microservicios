const { aerospikeDBParams } = require('../database/config');

const set = (bid, reference, value) => {
    // Check quantities table to make sure no other item with same reference exists
    let exist = false;

    if (exist) {
        // Update value of Item to new value
    } else {
        // Create new quantity in quantities table.
    }
    // Store new change_history in change_histories table
    // Publish event on Kafka
}