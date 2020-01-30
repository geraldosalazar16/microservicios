'use strict';

const http = require('http');

class DiscountApplier {

    /**
     * Class constructor
     * @example var DiscountApplier = new DiscountApplier()
     */
    constructor() {
    }


    /**
     * Initializes the token repo
     * @param {Object | String} params Can be a JSON object with the configuration parameters or
     * a path to the json config file
     */
    init(params) {
        let config = {};
        if (Object.prototype.toString.call(params) === '[object String]') {
            config = require(params);
        } else {
            config = params;
        }
    }


    /**
     * Call Discount applier to get discounted price of item
     * @param {String} bid
     * @param {String} chid
     * @param {Array} items
     * @returns {Promise<unknown>}
     */
    apply(bid, chid, items) {
        const config = require('./DiscounteApplierLib.json');
        const data = JSON.stringify({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            bid: bid,
            chid: chid,
            items: items
        });

        const options = {
            hostname: config.url,
            path: 'engine/apply',
            method: 'POST',
            port: '80',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }

        return new Promise((resolve, reject) => {
            const req = http.request(options, (res) => {
                res.setEncoding('utf8');
                res.on('data', (d) => {
                    resolve(d);
                })
            });

            req.on('error', (e) => {
                reject(e);
            });

            req.write(data);
            req.end();
        });
    }

}

module.exports = DiscountApplier;