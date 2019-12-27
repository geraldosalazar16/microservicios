exports.success = (message) => {
    return {
        status: 'success',
        message
    }
}

exports.failure = (message) => {
    return {
        status: 'failed',
        message
    }
}