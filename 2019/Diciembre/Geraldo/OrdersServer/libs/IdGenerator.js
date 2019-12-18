const uuidv4 = require('uuid/v4');

exports.getNextId = async () => {
    return uuidv4();
}