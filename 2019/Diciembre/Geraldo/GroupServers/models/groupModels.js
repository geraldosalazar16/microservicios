/**
 * Create group
 * @param {Object} data with name, title and desc
 */
exports.createGroup = ({user_id, name, title, desc}, db) => {
    return new Promise((resolve) => {
        db.collection('groups').insertOne({name , title, desc}, (err,result) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
               
            resolve({
                status: 'success',
                message: 'Group Saved successfully'
            });    
        });
    });
}

/**
 * Delete group
 * @param {Object} data with name
 */
exports.deleteGroup = ({name}, db) => {
    return new Promise((resolve) => {
        db.collection('groups').deleteOne({name}, (err,result) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            const message = result.deletedCount === 0 ? "Group not Found" : "Group deleted";
            const status = result.deletedCount === 0 ? "failed": "success";
            resolve({
                status,
                message
            });
        });
    });
}

/**
 * Update group
 * @param {Object} data with name, title and desc
 */
exports.updateGroup = ({name, title, desc}, db) => {
    return new Promise((resolve) => {
        db.collection('groups').updateOne({ name },{$set: {title, desc}}, (err,result) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            const message = result.matchedCount === 0 ? "Group not Found" : "Group updated";
            const status = result.matchedCount === 0 ? "failed": "success";
            resolve({
                status,
                message
            });
        });
    });
}