const business = require('../models/business.model');
const Authorization = require('../lib/Authorization');
const generateCode = require('../generateCode/generateCode');
const role = require('../models/role.model');
const kafkaSend = require('../kafka');

exports.create = async({ user_id, role_name, bid, role_title, role_desc, permissions }) => {
    try {
        if (await new Authorization().authorize({ user_id, bid })) {

            var businessTemp = await business.find({ created_by: user_id, bid: bid })[0];
            var exists_rol_name = businessTemp.roles.
            find((rol) => {
                return rol.name == role_name;
            });

            if (exists_rol_name) {
                return {
                    status: "Failed",
                    message: "rol with same unique name already exists"
                }
            }

            const role_id = generateCode.getNextId();
            businessTemp.roles.push(new role({
                role_id,
                name: role_name,
                title: role_title,
                desc: role_desc,
                created_at: new Date(),
                created_by: user_id,
                permissions: permissions
            }));

            var query = { created_by: user_id, bid: bid };

            var valueUpdate = { $set: { roles: businessTemp.roles } };

            if (await business.updateMany(query, valueUpdate).acknowledged) {
                // Publish event on Kafka
                const kafkaMessage = JSON.stringify({
                    user_id: user_id,
                    role_id: dep_id,
                    role_name: role_name,
                    role_title: role_title,
                    role_desc: role_desc,
                    bid: bid,
                    created_at: new Date(),
                    created_by: user_id
                });
                kafkaSend('business_role_created', kafkaMessage);
                return {
                    status: "success",
                    message: "Is update rol successfull"
                }
            } else {
                return {
                    status: "faild",
                    message: "Is update business faild"
                }
            }
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        }
    }
}


exports.edit = async({ user_id, role_id, name, bid, decription, permissions }) => {
    try {
        if (await new Authorization().authorize({ user_id, bid })) {
            var businessTemp = await business.find({ created_by: user_id, bid: bid })[0];
            var exists_rol_name = businessTemp.roles.
            find((rol) => {
                if (rol.role_id == dep_id) {
                    rol.name = name;
                    rol.desc = description;
                    rol.permissions = permissions;
                }
                return rol.role_id == role_id;
            });
            if (!exists_rol_name) {
                return {
                    status: "Failed",
                    message: "rol with same unique name already not exists"
                }
            }
            var query = { created_by: user_id, bid: bid };
            var valueUpdate = { $set: { roles: businessTemp.roles } };
            if (await business.updateMany(query, valueUpdate).acknowledged) {
                // Publish event on Kafka
                // Publish event on Kafka
                const kafkaMessage = JSON.stringify({
                    user_id: user_id,
                    role_id: dep_id,
                    bid: bid,
                    name: name,
                    description: decription
                });
                kafkaSend('business_role_created', kafkaMessage);
                res.status(200).json({
                    status: "success",
                    message: "Is update business successfull"
                });
            } else {
                return {
                    status: "faild",
                    message: "Is update business faild"
                }
            }
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        }
    }
}

exports.del = async({ user_id, role_id, bid }) => {
    try {
        if (await new Authorization().authorize({ user_id, bid })) {
            var businessTemp = await business.find({ created_by: user_id, bid: bid })[0];
            var description = ""
            var name = ""
            var exists_rol_name = businessTemp.roles.
            filter((rol) => {
                if (rol.role_id == role_id) {
                    description = rol.role_desc
                    name = rol.role_name
                }
                return rol.role_id != role_id;
            });
            if (!exists_rol_name) {
                return {
                    status: "Failed",
                    message: "rol with same unique name already not exists"
                }
            }
            var query = { created_by: user_id, bid: bid };
            var valueUpdate = { $set: { roles: businessTemp.roles } };
            if (await business.updateMany(query, valueUpdate).acknowledged) {
                // Publish event on Kafka
                const kafkaMessage = JSON.stringify({
                    user_id: user_id,
                    role_id: dep_id,
                    bid: bid,
                    name: name,
                    description: description
                });
                kafkaSend('business_role_created', kafkaMessage);
                return {
                    status: "success",
                    message: "Is update business successfull"
                }
            } else {
                return {
                    status: "faild",
                    message: "Is update business faild"
                }
            }
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        }
    }
}

exports.list = async function({ user_id, bid }) {
    try {
        if (await new Authorization().authorize({ user_id, bid }))
            return business.find({ created_by: user_id, bid: bid })[0].roles;
        return Array()
    } catch (error) {
        return Array()
    }
}