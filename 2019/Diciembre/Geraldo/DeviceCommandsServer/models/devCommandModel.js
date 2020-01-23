/**
 * Get dev_command from dev_commands table using code
 * @param {Object} data 
 * @param {Object} db mongodb db object
 * @returns {Promise} Document
 */
exports.get = (code, db) => {
    return new Promise((resolve, reject) => {
        db.collection("dev_command").findOne({code}, (err, document) => {
            if (err) {
                reject(err);
            }
            resolve(document);
        });
    })
    
}