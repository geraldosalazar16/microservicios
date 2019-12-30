/**
 * Create Member
 * @param {Object} data with name, peer_id and role_id
 */
exports.createMember = ({name, peer_id, role_id}, db) => {
    return new Promise((resolve) => {
        db.collection('members').insertOne({name, peer_id, role_id}, (err,result) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            resolve({
                status: 'success',
                message: 'Member Saved'
            });
        });
    });
}

/**
 * Delete Members
 * @param {Object} data with name
 */
exports.deleteMembers = ({name}, db) => {
    return new Promise((resolve) => {
        db.collection('members').deleteMany({name}, (err,result) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            const message = result.deletedCount === 0 ? "Member not Found" : "Member deleted";
            const status = result.deletedCount === 0 ? "failed": "success";
            resolve({
                status,
                message
            });
        });
    });
}


/**
 * List Members
 * @param {Object} data with name
 * @returns List of members
 */
exports.listMembers = ({name}, db) => {
    return new Promise((resolve) => {
        db.collection('members').find({name}).toArray((err,docs) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            resolve({
                status: 'success',
                docs
            });
        });
    });
}

/**
 * Update role Member
 * @param {Object} data with name, peer_id and role_id
 */
exports.updateRole = ({name, peer_id, role_id}, db) => {
    return new Promise((resolve) => {
        db.collection('members').updateOne({ name, peer_id }, {$set: {role_id} }, (err,result) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            const message = result.matchedCount === 0 ? "Member not Found" : "Member role updated";
            const status = result.matchedCount === 0 ? "failed": "success";
            resolve({
                status,
                message
            });
        });
    });
}