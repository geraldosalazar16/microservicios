exports.arrAlphabetic = 'ABCDEFGHJKMNPQRSTUVWXYZ';
exports.arrAlphanumeric = '1234567890ABCDEFGHJKMNPQRSTUVWXYZ';

/**
 * Given a length, return a random string
 * @param {Number} len
 * @returns {String} Random string
 */
exports.random = (len, arr) => { 
    let ans = ''; 
    for (let i = len; i > 0; i--) { 
        ans +=  
        arr[Math.floor(Math.random() * arr.length)]; 
    } 
    return ans; 
} 