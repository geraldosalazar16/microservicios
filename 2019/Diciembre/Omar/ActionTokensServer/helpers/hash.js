const crypto = require('crypto');

/**
 * Hash a string with sha512
 * @params {string} payload
 * @returns 
 */
module.exports = (payload) => {
    const hash = crypto.createHash('sha512');
    const data = hash.update(payload, 'utf-8');
    return data.digest('hex');
}