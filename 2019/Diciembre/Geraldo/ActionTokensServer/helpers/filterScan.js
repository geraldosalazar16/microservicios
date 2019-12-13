/**
 * Filter scan searching for a value
 * @param {Object} scan
 * @returns {Object} Response with the result of the search
 */
module.exports = async (scan, filter) => {
    return new Promise((resolve, reject) => {
        const errors = [];
        let found = false;
        let record;
        let fullRecord;
        var stream = scan.foreach()
        stream.on('data', function (r) {
            if (r.bins[filter.field] === filter.value) {
                found = true;
                record = r.bins;
                fullRecord = r;
            }
        })
        stream.on('error', function (error) {
            errors.push(`Error while scanning: ${error.message} [${error.code}]`);
        })
        stream.on('end', function () {
            if (found) {
                resolve({
                    status: 'success',
                    record,
                    fullRecord
                });
            } else {
                resolve({
                    status: 'failed',
                    message: 'Record not found',
                    errors
                });
            }
        })
    });
}
