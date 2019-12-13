const hashSha512 = require('./hash');

/**
 * Validate masterId and MasterSecret against the configuration file
 * @params {string} masterId
 * @params {string} masterSecret
 * @returns {boolean} Result of the comparition between the provided credentials
 * and the ones stored in the configuration file. If configuration file does not exist returns false
 */
module.exports = ({masterId, masterSecret}) => {
    try {
        const config = readConfig();
        const genHash = hashSha512(masterSecret);
        return masterId === config.masterId && config.masterSecret === genHash;
    } catch (error) {
        return false;
    }
}

function readConfig() {
    return require('../config.json')
}