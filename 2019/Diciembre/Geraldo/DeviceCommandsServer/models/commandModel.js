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
        const query = {};
        if (type) {
            query.type = type;
        }
        if (purpose) {
            query.purpose = purpose;
        }
        db.collection('commands').find(query).toArray((err, result) => {
            if(err) {
                reject(err)
            }
            resolve(result);
        });
    });
}

/**
 * Search for a command with code
 * @param {String} code Code
 * @param {Object} db mongodb db object
 * @returns Result of the search
 */
exports.get = (code, db) => {
    return new Promise((resolve, reject) => {
        db.collection("commands").findOne({code}, (err, document) => {
            if (err) {
                reject(err);
            }
            resolve(document);
        });
    })
}
