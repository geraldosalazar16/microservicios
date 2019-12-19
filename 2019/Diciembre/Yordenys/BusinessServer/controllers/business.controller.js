const business = require('../models/business.model');
const Authorization = require('../lib/Authorization');
const generateCode = require('../generateCode/generateCode');
const kafkaSend = require('../kafka');

function ExistsCodeGenerate() {
    var Count_Code = 0;
    var code = "";
    do {
        code = generateCode.getNextId();
        Count_Code = business.find({ bid: code }).count();
    } while (Count_Code != 0);
    return code;
}

exports.create = async({ user_id, unique_name, name, decription }) => {
    try {
        if (await new Authorization().authorize({ user_id: user_id })) {
            // Check unique_name already exists
            var is_unique_name = await business.find({ created_by: user_id, unique_name: unique_name }).count();
            if (is_unique_name != 0) {
                return {
                    status: "Failed",
                    message: "Business with same unique name already exists"
                }
            }
            var unique_code = await generateCode.getNextId(unique_name);
            var bid = generateCode.getNextCode()
                // Store business in database
            const newbusiness = new business({
                bid,
                created_at: new Date().toString(),
                created_by: user_id,
                unique_name: unique_name,
                unique_code: unique_code,
                name: name,
                description: decription,
                departments: [],
                roles: []
            })
            await newbusiness.save()
                // Publish event on Kafka
            const kafkaMessage = JSON.stringify({
                user_id: user_id,
                unique_name: unique_name,
                name: name,
                description: description,
                bid,
                unique_code,
                created_at: new Date(),
                created_by: user_id
            })
            kafkaSend('business_created', kafkaMessage);
            //return unique_code;
            return {
                status: "success",
                unique_code
            }
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };

    }
}

exports.del = async({ user_id, bid }) => {
    try {
        if (await new Authorization().authorize({ user_id, bid })) {
            var query = { created_by: user_id, bid: bid };
            temp_business = business.find({ created_by: user_id, bid: bid })[0]
            if (await business.deleteMany(query)) {
                // Publish event on Kafka
                const kafkaMessage = JSON.stringify({
                    user_id: user_id,
                    bid: bid,
                    decription: temp_business.decription,
                    name: temp_business.name
                });
                kafkaSend('business_deleted', kafkaMessage);
                return {
                    status: "success",
                    message: "Is delete business successfull"
                };
            } else {
                return {
                    status: "faild",
                    message: "Is delete business faild"
                };
            }
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };
    }
}

exports.edit = async({ user_id, bid, name, description }) => {
    try {
        if (await new Authorization().authorize({ user_id, bid })) {
            var query = { created_by: user_id, bid: bid };
            var valueUpdate = { $set: { name: name, description: description } };
            if (await business.updateMany(query, valueUpdate).acknowledged) {
                // Publish event on Kafka
                const kafkaMessage = JSON.stringify({
                    user_id: user_id,
                    name: name,
                    description: description,
                    bid: bid
                });
                kafkaSend('business_updated', kafkaMessage);
                return {
                    status: "success",
                    message: "Is update business successfull"
                };
            } else {
                return {
                    status: "faild",
                    message: "Is update business faild"
                };
            }
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };
    }
}