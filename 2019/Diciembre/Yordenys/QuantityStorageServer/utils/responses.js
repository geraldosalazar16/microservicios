exports.success = (message, data = [], errors = []) => {
    return {
        status: 'success',
        message,
        data,
        errors
    }
}

exports.failure = (message, data = [], errors = []) => {
    return {
        status: 'failed',
        message,
        data,
        errors
    }
}