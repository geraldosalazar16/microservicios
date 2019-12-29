const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    title: { type: String },
    desc: { type: String }
})

const groupModel = mongoose.model('groups',groupSchema);
exports.createGroup = (group) => {
    const g = new groupModel(group);
    return new Promise(resolve => {
        g.save((error, data) => {
            if(error) {
                resolve({
                    status: 'failed',
                    message: error.message
                });
            }
            resolve({
                status: 'success',
                message: 'Group saved'
            });
        });
    })
}

exports.deleteGroup = ({name}) => {
    return new Promise(resolve => {
        groupModel.deleteOne({
            name
        },(err, result) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            const message = result.deletedCount === 0 ? 'Group not found' : 'Group deleted';
            const status = result.deletedCount === 0 ? 'failed' : 'success';
            resolve({
                status,
                message
            });
        });
    });
}

exports.updateGroup = ({name,title,desc}) => {
    return new Promise(resolve => {
        groupModel.updateOne({
             name
        },{
            title,
            desc
        },(err, result) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            const message = result.updatedCount === 0 ? 'Group not found' : 'Group updated';
            const status = result.updatedCount === 0 ? 'failed' : 'success';
            resolve({
                status,
                message
            });
        });
    });
}