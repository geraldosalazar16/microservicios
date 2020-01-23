/**
 * insert new record in usage_history collection
 * @param {Object} data 
 * @param {Object} db mongodb db object
 * @returns {Promise} Document
 */
exports.insert = (data, db) => {
    return new Promise((resolve, reject) => {
        db.collection("usage_history").insertOne(data, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    })
    
}