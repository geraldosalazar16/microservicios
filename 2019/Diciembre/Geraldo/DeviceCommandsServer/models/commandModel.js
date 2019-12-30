/**
 * List commands
 * @param {Object} data with type, purpose
 * If type & data === null Query all commands
 * If one of the properties is null and the other not, query based on that property
 * If type & data !== null Query commands by type and purpose
 * @returns List of commands
 */
exports.list = ({type, purpose}, db) => {
    return new Promise((resolve, reject) => {
        // Get list of commands
        const query = Object.assign({}, type, purpose);
        db.collection('commands').find(query).toArray((err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result);
        });
    });
}
