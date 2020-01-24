const config = require('../config')
const sha512 = require('js-sha512').sha512;
const clients = require('../models/client.model');
const uniqid = require('uniqid');

//check masterid and masterid by parameters match
function check_masterid(masterId, masterSecret) {
    //obtaining the hash of the parameters passed by the masterId masterSecret users
    var Hash = sha512.hmac(masterId, masterSecret)
        //I compare the hash obtained with that of the configuration file
    return config.masterSecret == Hash
}

//creater client 
exports.create = async({ masterId, masterSecret, name, title, desc }) => {
    try {
        //ckecking masterid
        if (!check_masterid(masterId, masterSecret)) {
            return {
                status: 'Failed',
                message: 'it is  not  math masterid'
            };
        }

        //created to clientId
        var clientId = name + uniqid()

        //created to clientSecret
        var clientSecret = sha512.hmac(clientId, name);

        //created  record of  client
        const client = new clients({
                clientId,
                clientSecret,
                name,
                title,
                desc,
                active: true
            })
            //save  client
        await client.save()
        return {
            status: "success",
            message: "business is  insert successfull",
            result: {
                clientId,
                clientSecret
            }
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };

    }
}

// delete  client 
exports.del = async(Params) => {
    try {
        var masterId = Params.masterId
        var masterSecret = Params.masterSecret

        //ckecking  masterid
        if (!check_masterid(masterId, masterSecret)) {
            return {
                status: 'Failed',
                message: 'it is  not  math masterid'
            };
        }
        var query = null

        //checking the clientId and name fields
        if (Params['clientId'])
            query = { 'clientId': Params['clientId'] }
        else if (Params['name'])
            query = { 'name': Params['name'] }
        if (query == null) {
            return {
                status: 'Failed',
                message: 'it is  clientId o name of the client'
            };
        }

        // deleting client
        if ((await clients.deleteMany(query))) {
            return {
                status: "success",
                message: "Is delete client successfull"
            };
        } else {
            return {
                status: "faild",
                message: "Is delete client faild"
            };
        }

    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };
    }
}

//block o  unblock  clients
async function block_unblock(Params, isblock) {
    try {
        //get masterid and masterSecret fields
        var masterId = Params.masterId
        var masterSecret = Params.masterSecret

        //chequear  masterid
        if (!check_masterid(masterId, masterSecret)) {
            return {
                status: 'Failed',
                message: 'it is  not  math masterid'
            };
        }

        var query = null
        var valueUpdate = null

        //checking the clientId and name fields
        if (Params['clientId']) {
            query = { 'clientId': Params['clientId'] }
        } else if (Params['name']) {
            query = { 'name': Params['name'] }
        }
        if (query == null) {
            return {
                status: 'Failed',
                message: 'it is  clientId o name of the client'
            };
        }

        //update condition
        valueUpdate = { $set: { "active": isblock } }

        // Is update clients
        if ((await clients.updateMany(query, valueUpdate)).ok) {
            return {
                status: "success",
                message: "Is update clients successfull"
            };
        } else {
            return {
                status: "faild",
                message: "Is update clients faild"
            };
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };
    }
}

//block   clients
exports.block = async(Params) => {
    return await block_unblock(Params, false)
}

//unblock   clients
exports.unblock = async(Params) => {
    return await block_unblock(Params, true)
}

//list of clientes 
exports.list = async({ masterId, masterSecret, clientId }) => {
    try {
        //chequear  master id
        if (!check_masterid(masterId, masterSecret)) {
            return {
                status: 'Failed',
                message: 'it is  not  math masterid'
            };
        }
        //get list  client
        return {
            status: "success",
            message: "",
            list: (await clients.find())
        };

    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };
    }
}