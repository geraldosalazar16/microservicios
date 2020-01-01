const Authorization = require('../libs/Authorization');
const { success, failure } = require('../utils/response');
const { sendMessages} = require('../kafka');
const groupDB = require('../models/groupModels');
const memberDB = require('../models/memberModels');

/**
 * Create a new group
 */
exports.create = async ({user_id, name, title, desc}, db) => {
    try{
        // Authorize
        const authorized = await Authorization.authorize('groups/create', {
            user_id,
            name
        });
        if (authorized.status === 'success') {
            // Create new group
            const result = await groupDB.createGroup({user_id, name, title, desc}, db);
            if( result.status === 'success'){
				const result1 = await memberDB.createMember({name, peer_id: user_id, role_id: "_owner"}, db);
                // Push to Kafka
                const message = JSON.stringify({
                user_id,
                name,
                title,
                desc,
                created_at : new Date().toString()
                });
                await sendMessages('group_created', message);
                return success(result.message);
            } else{
                return failure(result.message);
            }
        }
        else{
           return failure('Not authorized')
        }

    } catch (error) {
        return failure(error.message);
    };

}

/**
 * Delete a group
 */
exports.delete = async ({user_id, name}, db) => {
    try{
        // Authorize
        const authorized = await Authorization.authorize('groups/delete', {
            user_id,
            name
        });
        if (authorized.status === 'success') {
           
            const result = await groupDB.deleteGroup({name},db);
            if( result.status === 'success'){
                
                const result1 = await memberDB.deleteMembers({name},db);
                // Push to Kafka
                const message = JSON.stringify({
                user_id,
                name,
                created_at : new Date().toString()
                });
                await sendMessages('group_deleted', message);
                return success('Group deleted successfully');
            } else{
                return failure(result.message);
            }
        }
        else{
           return failure('Not authorized')
        }

    } catch (error) {
        return failure(error.message);
    };
}

/**
 * List a members of a group
 */
exports.list = async ({user_id, name},db) => {
    try{
        // Authorize
        const authorized = await Authorization.authorize('groups/list', {
            user_id,
            name
        });
        if (authorized.status === 'success') {
            
            const result = await memberDB.listMembers({name},db);
            if( result.status === 'success'){
                return {
                    status : 'success',
                    message: 'Members listed succesfully',
                    members: result.docs
                };
            } else{
                return failure(result.message);
            }
        }
        else{
           return failure('Not authorized')
        }

    } catch (error) {
        return {
            status: 'failed',
            message: error.message
        }
    };
}

/**
 * Join to a group
 */
exports.join = async ({user_id, name}, db) => {
    try{
        // Authorize
        const authorized = await Authorization.authorize('groups/join', {
            user_id,
            name
        });
        if (authorized.status === 'success') {
            // Create new group
            const member = {
                name,
                peer_id: user_id,
                role_id: '_member'
            };
            const result = await memberDB.createMember(member,db);
            if( result.status === 'success'){
                
                // Push to Kafka
                const message = JSON.stringify({
                user_id,
                name,
                role_id : '_member',
                created_at : new Date().toString()
                });
                await sendMessages('user_joined_group', message);
                return success('Member joined successfully');
            } else{
                return failure(result.message);
            }
        }
        else{
           return failure('Not authorized')
        }

    } catch (error) {
        return failure(error.message);
    };

}


/**
 * Update role of user
 */
exports.updateRole = async ({user_id, name, peer_id, role_id},db) => {
    try{
        // Authorize
        const authorized = await Authorization.authorize('groups/update/role', {
            user_id,
            name
        });
        if (authorized.status === 'success') {
            // Create new group
            const member = {
                name,
                peer_id,
                role_id
            };
            const result = await memberDB.updateRole(member,db);
            if( result.status === 'success'){
                
                // Push to Kafka
                const message = JSON.stringify({
                user_id,
                name,
                role_id,
                peer_id,
                created_at : new Date().toString()
                });
                await sendMessages('user_group_role_updated', message);
                return success('Member role updated successfully');
            } else{
                return failure(result.message);
            }
        }
        else{
           return failure('Not authorized')
        }

    } catch (error) {
        return failure(error.message);
    };

}

/**
 * Update group
 */
exports.editGroup = async ({user_id, name, title, desc},db) => {
    try{
        // Authorize
        const authorized = await Authorization.authorize('groups/edit', {
            user_id,
            name
        });
        if (authorized.status === 'success') {
            // Create new group
            const group = {
                name,
                title,
                desc
            };
            const result = await groupDB.updateGroup(group,db);
            if( result.status === 'success'){
                
                // Push to Kafka
                const message = JSON.stringify({
                user_id,
                name,
                title,
                desc,
                created_at : new Date().toString()
                });
                await sendMessages('group_update', message);
                return success('Group updated successfully');
            } else{
                return failure(result.message);
            }
        }
        else{
           return failure('Not authorized')
        }

    } catch (error) {
        return failure(error.message);
    };

}