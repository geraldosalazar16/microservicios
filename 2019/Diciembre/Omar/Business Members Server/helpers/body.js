/**
 * Validates that the body of the request is not empty
 * @param {Object} body Request body
 * @returns {Object} Response whith status and parsed body (if valid)
 */
module.exports = (body) => {
    if (!body) {
        return {
            status: 'failed',
            message: 'Bad request. No POST body.'
        };
    }

    let data;
    if (typeof body === 'string') {
        try {
            return {
                status: 'success',
                body: JSON.parse(body)
            }
        } catch {
            return {
                status: 'failed',
                message: 'Bad request. POST body must be valid JSON.'
            };
        }
    } else {
        return {
            status: 'success',
            body
        }
    }
}