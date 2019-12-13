/**
 * Read data from query or scan
 * @param {Object} query
 * @returns {Object} Response with an array of records (ig any)
 * and an array on errors (if any)
 */
module.exports = async (query) => {
    return new Promise((resolve, reject) => {
        const records = [];
        const errors = [];
        var stream = query.foreach()
        stream.on('data', function (record) {
            const client = {
                clientId: record.bins.clientId,
                name: record.bins.name,
                title: record.bins.title,
                desc: record.bins.desc,
                active: record.bins.active,
            };
            records.push(client);
        })
        stream.on('error', function (error) {
            errors.push(`Error while scanning: ${error.message} [${error.code}]`);
        })
        stream.on('end', function () {
            resolve({
                records,
                errors
            });
        })
    });
}
