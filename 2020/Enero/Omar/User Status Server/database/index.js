const redis = require('redis');
const redisClient = redis.createClient();


exports.setstate = (user_id, state) => {
    return new Promise(resolve => {
        redisClient.hset('state', user_id, state, (err, collection) => {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                })
            } else {
                resolve({
                    status: 'success',
                    message: 'State added succesfully'
                })
            }
        });
    });
}


exports.getstate = (user_id) => {
    return new Promise(resolve => {
        redisClient.hget('state', user_id, function (err, resp) {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                })
            }

            resolve({
                status: 'success',
                message: resp
            })
        })
    });
}


exports.setstatus = (user_id, status) => {
    return new Promise(resolve => {
        redisClient.hset('status', user_id, status, (err, collection) => {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                })
            } else {
                resolve({
                    status: 'success',
                    message: 'Status added succesfully'
                })
            }
        });
    });
}


exports.getstatus = (user_id) => {
    return new Promise(resolve => {
        redisClient.hget('status', user_id, function (err, resp) {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                })
            }

            resolve({
                status: 'success',
                message: resp
            })
        })
    });
}


exports.setlastseen = (user_id, datetime) => {
    return new Promise(resolve => {
        redisClient.hset("lastseen", user_id, datetime, (err, collection) => {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                })
            } else {
                resolve({
                    status: 'success',
                    message: 'Date added succesfully'
                })
            }
        });
    });
}


exports.getlastseen = (user_id) => {
    return new Promise(resolve => {
        redisClient.hget('lastseen', user_id, function (err, resp) {
            if (err) {
                resolve({
                    status: 'failed',
                    message: err.message
                })
            }

            resolve({
                status: 'success',
                message: resp
            })
        })
    });
}