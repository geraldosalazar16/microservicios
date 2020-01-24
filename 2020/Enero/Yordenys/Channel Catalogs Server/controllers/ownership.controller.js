const databaseApi = require('../lib/database');
const Authorization = require('../lib/Authorization')
const kafkaSend = require('../kafka');

//Bind a catalog to a channel
exports.bind = async({ user_id, bid, chid, gid }) => {
    try {
        //checking Authorization
        if (await Authorization.authorize("channel_catalogs/ownership/bind", { user_id, bid, chid, gid })) {

            //Create a new record in ownership table with bid, chid and gid

            var records = await databaseApi.query("insert into ownership(bid,chid,gid)values('" + bid + "','" + chid + "','" + gid + "')")

            //Publish event on Kafka
            const kafkaMessage = JSON.stringify({
                user_id,
                bid,
                chid,
                gid
            })
            kafkaSend('channel_catalogs_catalog_bound', kafkaMessage);

            // out result
            return {
                status: "success",
                message: "ownership is  insert successfull",
            }
        }
        return {
            status: "Failed",
            message: "You not access"
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };

    }
}


//Bind a group of catalogs to a channel
exports.bindAll = async({ user_id, bid, chid, gids }) => {
    try {
        //checking Authorization
        if (await Authorization.authorize("channel_catalogs/ownership/bind", { user_id, bid, chid, gids })) {

            //For each gid in gids list create a new record in ownership table with gid, bid and chid
            gids.forEach(gid => {
                databaseApi.query("insert into ownership(bid,chid,gid)values('" + bid + "','" + chid + "','" + gid + "')")
            });

            //Publish event on Kafka
            const kafkaMessage = JSON.stringify({
                user_id,
                bid,
                chid,
                gids
            })
            kafkaSend('channel_catalogs_catalog_group_bound', kafkaMessage);

            //out result
            return {
                status: "success",
                message: "ownership is  insert successfull",
            }
        }
        return {
            status: "Failed",
            message: "You not access"
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };

    }
}

//Unbind a catalog from a channel
exports.unbind = async({ user_id, bid, chid, gid }) => {
    try {
        //checking Authorization
        if (await Authorization.authorize("channel_catalogs/ownership/unbind", { user_id, bid, chid, gid })) {

            //Delete a record in ownership table with bid, chid and gid
            databaseApi.query("delete from ownership where (bid = '" + bid + "' and chid = '" + chid + "'  and gid = '" + gid + "')")

            //Publish event on Kafka
            const kafkaMessage = JSON.stringify({
                user_id,
                bid,
                chid,
                gid
            })
            kafkaSend('channel_catalogs_catalog_unbound', kafkaMessage);

            //out result
            return {
                status: "success",
                message: "ownership is  delete successfull",
            }
        }
        return {
            status: "Failed",
            message: "You not access"
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };

    }
}

//Unbind a group of catalogs from a channel
exports.unbindAll = async({ user_id, bid, chid, gids }) => {
    try {
        //checking Authorization
        if (await Authorization.authorize("channel_catalogs/ownership/unbind", { user_id, bid, chid, gids })) {

            //For each gid in gids list remove a record in ownership table with gid, bid and chid
            gids.forEach(gid => {
                databaseApi.query("delete from ownership where (bid = '" + bid + "' and chid = '" + chid + "'  and gid = '" + gid + "')")
            });

            //Publish event on Kafka
            const kafkaMessage = JSON.stringify({
                user_id,
                bid,
                chid,
                gids
            })
            kafkaSend('channel_catalogs_catalog_bound', kafkaMessage);

            //out result
            return {
                status: "success",
                message: "ownership is  delete successfull",
            }
        }
        return {
            status: "Failed",
            message: "You not access"
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };

    }
}


//Get bid and chid of a catalog
exports.get = async({ user_id, gid }, res) => {
    try {
        //checking Authorization
        if (await Authorization.authorize("channel_catalogs/ownership/get", { user_id, gid })) {

            //Get bid and chid of a catalog
            var result = (await databaseApi.get("select * from ownership where gid = '" + gid + "'", res))

        } else {
            return {
                status: "Failed",
                message: "You not access"
            }
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };
    }
}

//List catalogs of a channel.
exports.list = async({ user_id, bid, chid }, res) => {
    try {
        //checking Authorization
        if (await Authorization.authorize("channel_catalogs/ownership/list", { user_id, bid, chid })) {

            //Get all records with same bid and chid from ownership table
            var result = await databaseApi.list("select * from ownership where (bid = '" + bid + "' and  chid = '" + chid + "')", res)

        } else {
            return {
                status: "Failed",
                message: "You not access"
            }
        }
    } catch (error) {
        return {
            status: 'Failed',
            message: error.message
        };
    }
}