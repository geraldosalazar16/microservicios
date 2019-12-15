const hashSha512 = require('./hash');

module.exports = ({masterId, masterSecret}) => {
    try {
        const config = readConfig();
        const genHash = hashSha512(masterSecret);

        if (masterId === config.masterId) {
            if (config.masterSecret === genHash) {
                return true;
            } else {
                console.log('masterSecret invalido')
                return false;
            }
        } else {
            console.log('masterId invalido')
            return false;
        }
    } catch (error) {
        return false;
    }
}

function readConfig() {
    return require('../config.json')
}