// Modify the prices based on the channel and conditions.
const Rule = require('../models/rule.model')
const Clients = require('../models/client.model')
const { get } = require('../controllers/rule.controller')
const DiscountEngine = require('./DiscountEngine')

//checking clientId and clientSecret  in the clients table
async function exists_clients(clientId, clientSecret) {
    //clientId and clientSecret should be found in the clients table
    try {
        //get client
        if ((await Clients.find({ clientId, clientSecret, active: true }))[0])
            return true
        return false
    } catch (error) {
        return {
            status: "failed",
            message: error
        }
    }
}

//Modify the prices based on the channel and conditions.
exports.apply = async({ clientId, clientSecret, bid, chid, items }) => {
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

        //Get a rule from database with same bid and chid
        var rule = await get({ clientId, clientSecret, bid, chid, })

        //checking rule

        if (rule.status != "success") {
            //error
            return rule
        }
        // get rule
        rule = rule.rule

        //Define discounted_items as an empty list
        var discounted_items = []

        //For each item in items
        items.forEach(item => {
            results = DiscountEngine.validate(rule.conditions, item)
            var discounted_item = {}
            Object.assign(discounted_item, item)
            if (results.title == "success") {
                discounted_item.discounted_price = DiscountEngine.apply(item.price, rule.variation)
                discounted_item.discount = rule.variation
                discounted_item.discounted = true
            } else {
                discounted_item.discounted = false
            }
            discounted_items.push(discounted_item)
        })

        //out  list
        return discounted_items
    } catch (error) {

        //out error
        return {
            status: "failed",
            message: error
        }
    }
}