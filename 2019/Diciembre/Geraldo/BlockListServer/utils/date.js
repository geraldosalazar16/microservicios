/**
 * Converts a JS Date Object into MySQL string datetime
 * @param {Date} date JavaScript Date 
 * @returns {String} MySQL Datetime string format
 */
exports.getSQLDate = (date) => {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' '); 
}
