const db = require('../database');
const dateUtils = require('../utils/date');

/**
 * Add a record to white_peers table.
 * @param {Object} data Data with chid, peer_id 
 * @returns {Object} Operation result
 * {
 * result: 'success' or 'failed'
 * }
 */
exports.add = async ({chid, peer_id}) => {
    try {       
        const insertQuery = `INSERT INTO white_peers (chid, peer_id) VALUES ('${chid}','${peer_id}');`;
        const insertResult = await db.query(insertQuery);
        return {
            status: 'success'
        }
    } catch (error) {
        return {
            status: 'failed',
            message: error
        }
    }
}

/**
 * Remove a record to white_peers table.
 * @param {Object} data Data with chid, peer_id 
 * @returns {Object} Operation result
 * {
 * result: 'success' or 'failed'
 * }
 */
exports.remove = async ({chid, peer_id}) => {
    try {       
        const deleteQuery = `DELETE FROM white_peers WHERE chid = '${chid}' AND peer_id = '${peer_id}'`;
        const deleteResult = await db.query(deleteQuery);
        return {
            status: 'success'
        }
    } catch (error) {
        return {
            status: 'failed',
            message: error
        }
    }
}

/**
 * List records to white_peers table with same chid.
 * @param {Object} data Data with chid 
 * @returns {Object} Operation result
 * {
 * result: 'success' or 'failed'
 * }
 */
exports.list = async ({chid}) => {
    try {       
        const listQuery = `SELECT * FROM white_peers WHERE chid = '${chid}'`;
        const list = await db.query(listQuery);
        return {
            status: 'success',
            list
        }
    } catch (error) {
        return {
            status: 'failed',
            message: error
        }
    }
}

/**
 * Check if a record exist in white_peers table.
 * @param {Object} data Data with chid, peer_id 
 * @returns {Object} Operation result
 * {
 * result: 'success' or 'failed'
 * }
 */
exports.check = async ({chid, user_id}) => {
    try {       
        const checkQuery = `SELECT 1 FROM white_peers WHERE chid = '${chid}' AND peer_id = '${user_id}'`;
        const checkResult = await db.query(checkQuery);
        if (checkResult.length > 0) {
            return {
                status: 'success'
            }
        } else {
            return {
                status: 'failed',
                message: 'Not Allowed'
            }
        }  
    } catch (error) {
        return {
            status: 'failed',
            message: error
        }
    }
}