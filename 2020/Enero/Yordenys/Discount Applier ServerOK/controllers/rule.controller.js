const Rule = require('../models/rule.model')
const clientsModel = require('../models/client.model')
const DiscountEngine = require('../lib/DiscountEngine')

//checking clientId and clientSecret  in the clients table
async function exists_clients(clientId, clientSecret) {
    //clientId and clientSecret should be found in the clients table
    try {
        //get client
        if ((await clientsModel.find({ clientId, clientSecret, active: true }))[0])
            return true
        return false
    } catch (error) {
        return {
            status: "failed",
            message: error
        }
    }
}

//Creates a pattern for the channel.
exports.create = async({ clientId, clientSecret, bid, chid, variation, conditions }) => {
    try {
        //checking exists clients
        existsClient = await exists_clients(clientId, clientSecret)

        //checking if it is a mistake
        if (typeof(existsClient) != 'object') {
            if (!existsClient)
                return {
                    status: "failed",
                    message: "Unable to create role by mistake in customer data"
                }
        } else
            return existsClient

        //parse variation and conditions
        var result_parse = DiscountEngine.parser(variation, conditions)

        //If error: Return error object
        if (result_parse.title === "faild") {
            return {
                status: "failed",
                message: result_parse.message,
                item: result_parse.item
            }
        }

        //create rule
        var rule = new Rule({
            bid,
            chid,
            variation,
            conditions: result_parse.list_Conditions
        })

        //save rule
        await rule.save()

        // out  result
        return {
            status: "success",
            message: "Is update rol successfull"
        }
    } catch (error) {
        return {
            status: 'failed',
            message: error.message
        }
    }
}

//Updates a rule of the channel.

exports.update = async({ clientId, clientSecret, bid, chid, variation, conditions }) => {
    try {
        //checking exists clients
        existsClient = await exists_clients(clientId, clientSecret)

        //checking if it is a mistake
        if (typeof(existsClient) != 'object') {
            if (!existsClient)
                return {
                    status: "failed",
                    message: "Unable to create role by mistake in customer data"
                }
        } else
            return existsClient


        var query = { bid, chid };

        var valueUpdate = { $set: { variation, conditions } };



        //Updates a rule 
        if ((await Rule.updateMany(query, valueUpdate)).ok) {
            return {
                status: "success",
                message: "Is update rule successfull"
            };
        } else {
            return {
                status: "failed",
                message: "Is update rule faild"
            }
        }
    } catch (error) {
        return {
            status: 'failed',
            message: error.message
        }
    }
}

//Deletes a rule of the channel.
exports.del = async({ clientId, clientSecret, bid, chid }) => {
    try {
        //checking exists clients
        existsClient = await exists_clients(clientId, clientSecret)

        //checking if it is a mistake
        if (typeof(existsClient) != 'object') {
            if (!existsClient)
                return {
                    status: "failed",
                    message: "Unable to create role by mistake in customer data"
                }
        } else
            return existsClient

        var query_delete = { bid, chid }

        //delete rule
        if ((await Rule.deleteMany(query_delete))) {
            return {
                status: "success",
                message: "Is rule delete successfull"
            }
        }
        return {
            status: "failed",
            message: "Is rule delete failed"
        }
    } catch (error) {
        return {
            status: 'failed',
            message: error.message
        }
    }
}

//List all rule of the business.
exports.list = async function({ clientId, clientSecret, bid }) {
    try {
        //checking exists clients
        existsClient = await exists_clients(clientId, clientSecret)

        //checking if it is a mistake
        if (typeof(existsClient) != 'object') {
            if (!existsClient)
                return {
                    status: "failed",
                    message: "Unable to create role by mistake in customer data"
                }
        } else
            return existsClient

        //List all rule.
        return (await Rule.find({ bid }));
    } catch (error) {
        return Array()
    }
}

//Get a rule from database.
exports.get = async function({ clientId, clientSecret, bid, chid }) {
    try {
        //checking exists clients
        existsClient = await exists_clients(clientId, clientSecret)

        //checking if it is a mistake
        if (typeof(existsClient) != 'object') {
            if (!existsClient)
                return {
                    status: "failed",
                    message: "Unable to create role by mistake in customer data"
                }
        } else
            return existsClient

        //get a rule.
        var rule = (await Rule.find({ bid, chid }))

        //checking error 
        if (rule.length != 0) {
            return {
                status: 'success',
                message: "",
                rule: rule[0]
            }
        } else {
            return {
                status: 'failed',
                message: "is not getting rule"
            }
        }
    } catch (error) {
        return {
            status: 'failed',
            message: error
        }
    }
}