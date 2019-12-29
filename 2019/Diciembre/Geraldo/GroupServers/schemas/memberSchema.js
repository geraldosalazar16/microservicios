const mongoose = require('mongoose');
const {success, failure } = require('../utils/response')

const memberSchema = new mongoose.Schema({
    name: String,
    peer_id: String,
    role_id: String
})
const memberModel = mongoose.model('members',memberSchema);
exports.createMember = (member) => {
    const m = new memberModel(member);
    return new Promise(resolve => {
        m.save((error, data)=> {
            if(error){
                resolve({
                    status: 'failed',
                    message: error.message
                });
            }
            resolve({
                status: 'success',
                message: 'Member saved'
            });

        });

    })
}

exports.deleteMembers = ({name}) => {
    return new Promise(resolve => {
        memberModel.deleteMany({
            name
        },(err, result) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            const message = result.deletedCount === 0 ? 'Member not found' : 'Member deleted';
            const status = result.deletedCount === 0 ? 'failed' : 'success';
            resolve({
                status,
                message
            });
        });
    });
}

exports.listMembers = ({name}) => {
    return new Promise(resolve => {
        memberModel.find({
            name
        },(err, docs) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            resolve({
                status : 'success',
                docs
            });
        });
    });
}

exports.updateRole = ({name, peer_id, role_id}) => {
    return new Promise(resolve => {
        memberModel.updateOne({
            name,
            peer_id
        },{
            role_id
        },(err, result) => {
            if(err) {
                resolve({
                    status: 'failed',
                    message: err.message
                });
            }
            const message = result.updatedCount === 0 ? 'Member not found' : 'Member role updated';
            const status = result.updatedCount === 0 ? 'failed' : 'success';
            resolve({
                status,
                message
            });
        });
    });
}