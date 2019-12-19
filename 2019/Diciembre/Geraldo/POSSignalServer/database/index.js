const redis = require('redis');
const redisClient = redis.createClient();

/**
 * Add a register to redis collection
 * @param {String} redisKey Collection name
 * @param {Object} register Register to add
 * @param {Array} compareFields Fields to determine if the register already exist
 */
exports.add = (redisKey, register, compareFields = []) => {
    return new Promise(resolve => {
        redisClient.get(redisKey, (err, collection) => {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                })
            } else {
                // If collection exist, parse it, else create an empty array
                const parsedData = collection ? JSON.parse(collection) : [];
                // If compareFields received, check if the record exist
                if (compareFields.length > 0) {
                    const indexFound = parsedData.findIndex((element) => {
                        let equals = true;
                        compareFields.forEach(field => {
                            if (element[field] !== register[field]) {
                                equals = false;
                            }
                        });
                        return equals;
                    });
                    if (indexFound >= 0) {
                        parsedData[indexFound] = register;
                    } else {
                        parsedData.push(register);
                    }
                } else {
                    parsedData.push(register);
                }
                // Push the new register
                redisClient.set(redisKey, JSON.stringify(parsedData));
                resolve({
                    status: 'success',
                    message: 'Register added succesfully'
                })
            }
        });
    })
}