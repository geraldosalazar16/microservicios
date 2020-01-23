const business = require('../models/business.model');
const Authorization = require('../lib/Authorization');
const generateCode = require('../generateCode/generateCode');
const department = require('../models/department.model');
const kafkaSend = require('../kafka');

/**
 * This API creates a department and stores it in department table
 * @param req
 * @param res
 * @returns {Promise<void>}
 */

exports.create = async({ user_id, bid, dep_name, dep_title, dep_desc, }) => {
    try {
        if (await Authorization.authorize({ user_id: user_id })) {
            
            const dep_id = generateCode.getNextId();
            businessTemp.departments.push(new department({
                dep_id,
                dep_name: dep_name,
                dep_title: dep_title,
                dep_desc: dep_desc,
                created_at: new Date().toString(),
                created_by: user_id
            }));
            var query = { created_by: user_id, bid: bid };
            var valueUpdate = { $set: { departments: businessTemp.departments } };

            if ((await business.updateMany(query, valueUpdate)).ok) {
                // Publish event on Kafka
                const kafkaMessage = JSON.stringify({
                    user_id: user_id,
                    dep_id,
                    dep_name: dep_name,
                    dep_title: dep_title,
                    dep_desc: dep_desc,
                    bid: bid,
                    created_at: new Date().toString(),
                    created_by: user_id
                });
                kafkaSend('business_department_created', kafkaMessage);
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
        } else {
            return {
                status: 'Failed',
                message: 'Authorization failed'
            }
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        }
    }
}

exports.edit = async({ user_id, bid, name, dep_id, decription }) => {
    try {
        if (await Authorization.authorize({ user_id: user_id })) {
            var businessTemp = (await business.find({ created_by: user_id, bid: bid }))[0]
            businessTemp.departments.
            find((depart) => {
                if (depart.dep_id == dep_id) {
                    depart.dep_name = name;
                    depart.dep_desc = decription;
                }
                return depart.dep_id == dep_id;
            });
            console.log(businessTemp)
            var query = { created_by: user_id, bid: bid };
            var valueUpdate = { $set: { departments: businessTemp.departments } };
            if ((await business.updateMany(query, valueUpdate)).ok) {
                // Publish event on Kafka
                const kafkaMessage = JSON.stringify({
                    user_id: user_id,
                    dep_id: dep_id,
                    bid: bid,
                    name: name,
                    description: decription
                });
                kafkaSend('business_department_updated', kafkaMessage);
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

exports.list = async({ user_id, bid, dep_id }) => {
    try {
        if (await Authorization.authorize({ user_id: user_id })) {
            return (await business.find({ created_by: user_id, bid: bid }))[0].departments;;
        } else {
            return Array();
        }
    } catch (error) {
        return Array();
    }
}

exports.del = async function({ user_id, bid, dep_id }) {
    try {
        if (await Authorization.authorize({ user_id: user_id })) {
            var description = ""
            var name = ""
            var businessTemp = (await business.find({ created_by: user_id, bid: bid }))[0]
            businessTemp.departments = businessTemp.departments.
            filter((depart) => {
                description = depart.description
                name = depart.name
                return depart.dep_id != dep_id;
            });
            var query = { created_by: user_id, bid: bid };
            var valueUpdate = { $set: { departments: businessTemp.departments } };
            if ((await business.updateMany(query, valueUpdate)).ok) {
                // Publish event on Kafka
                const kafkaMessage = JSON.stringify({
                    user_id: user_id,
                    dep_id: dep_id,
                    bid: bid,
                    name: name,
                    description: description
                });
                kafkaSend('business_department_updated', kafkaMessage);
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