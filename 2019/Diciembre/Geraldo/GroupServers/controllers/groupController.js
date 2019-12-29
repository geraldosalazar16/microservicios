const Authorization = require('../libs/Authorization');
const { sendMessages} = require('../kafka');
const groupDB = require('../schemas/groupSchema');
const memberDB = require('../schemas/memberSchema');
const { success, failure} = require('../utils/response');
/**
 * Create a new group
 */
exports.create = async ({user_id, name, title, desc}) => {
    try{
        // Authorize
        const authorized = await Authorization.authorize('groups/create', {
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
            const result = await groupDB.createGroup(group);
            if( result.status === 'success'){
                const member = {
                    name,
                    peer_id: user_id,
                    role_id: '_owner'
                };
                const result1 = await memberDB.createMember(member);
                // Push to Kafka
                const message = JSON.stringify({
                user_id,
                name,
                title,
                desc,
                created_at : new Date().toString()
                });
                await sendMessages('group_created', message);
                return success('Group create successfully');
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
exports.delete = async ({user_id, name}) => {
    try{
        // Authorize
        const authorized = await Authorization.authorize('groups/delete', {
            user_id,
            name
        });
        if (authorized.status === 'success') {
           
            const result = await groupDB.deleteGroup({name});
            if( result.status === 'success'){
                
                const result1 = await memberDB.deleteMembers({name});
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
exports.list = async ({user_id, name}) => {
    try{
        // Authorize
        const authorized = await Authorization.authorize('groups/list', {
            user_id,
            name
        });
        if (authorized.status === 'success') {
            
            const result = await memberDB.listMembers({name});
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
exports.join = async ({user_id, name}) => {
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
            const result = await memberDB.createMember(member);
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
exports.updateRole = async ({user_id, name, peer_id, role_id}) => {
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
            const result = await memberDB.updateRole(member);
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
 * Update role of user
 */
exports.editGroup = async ({user_id, name, title, desc}) => {
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
            const result = await groupDB.updateGroup(group);
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