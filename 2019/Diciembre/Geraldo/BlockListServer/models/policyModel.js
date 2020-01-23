const db = require('../database');

/**
 * Write a policy into the database. If policy exist, overwrite policy value
 * @param {Object} policy 
 * @returns {Object} Operation result
 * {
 * result: 'success' or 'failed'
 * }
 */
exports.write = async ({chid, policy}) => {
    try {        
        // Search in database for the policy
        const searchQuery = `SELECT 1 FROM policy WHERE chid = "${chid}"`;
        const existingPolicy = await db.query(searchQuery);
        // If policy exist, update
        if (existingPolicy.length > 0) {
            const updateQuery = `UPDATE policy SET policy = "${policy}" WHERE chid = "${chid}"`;
            const updateResult = await db.query(updateQuery);
        } else {
            // Create the policy
            const insertQuery = `INSERT INTO policy (chid, policy) VALUES ("${chid}","${policy}")`;
            const insertResult = await db.query(insertQuery);
        }
        return {
            status: 'success'
        }
    } catch (error) {
        return {
            status: 'failed',
            error
        }
    }
}

exports.get = async (chid) => {
    const getQuery = `SELECT policy FROM policy WHERE chid = "${chid}"`;
    const result = await db.query(getQuery);
    if (result.length > 0) {
        return {
            status: 'success',
            policy: result[0].policy
        }
    } else {
        return {
            status: 'failed',
            message: 'Record not found'
        }
    }
}