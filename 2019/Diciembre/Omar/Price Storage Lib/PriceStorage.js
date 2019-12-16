'use strict';

const http = require('http');


class PriceStorage {

    /**
     * Class constructor
     * @example var price = new priceStorage()
     */
    constructor() {
    }

    /**
     * Charge the parameters of configuration
     * @param params { Object | String } params Can be a JSON object with the configuration parameters or
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
     * Calls price server to set value of price
     * @param bid
     * @param reference
     * @param value
     * @returns {Promise<unknown>}
     */
    set(bid, reference, value) {
        const config = require('./priceStorage.json');
        const data = JSON.stringify({
            bid: bid,
            reference: reference,
            value: value
        });
        const options = {
            hostname: config.url,
            path: '/price/set',
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

    /**
     * Calls price server to set value of price
     * @param params { Array { bid, reference, value} }
     * @returns {Promise<unknown>}
     */
    setBatch(params) {
        const config = require('./priceStorage.json');
        const data = JSON.stringify({
            params: params
        });
        const options = {
            hostname: config.url,
            path: '/price/set',
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

    /**
     * Calls price server to update value of price by input amount
     * @param bid
     * @param reference
     * @param amount
     * @returns {Promise<unknown>}
     */
    update(bid, reference, amount) {
        const config = require('./priceStorage.json');
        const data = JSON.stringify({
            bid: bid,
            reference: reference,
            amount: amount
        });
        const options = {
            hostname: config.url,
            path: '/price/update',
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

    /**
     * Calls price server to update value of price by input amount
     * @param params {Array {bid, reference, amount}}
     * @returns {Promise<unknown>}
     */
    updateBatch(params) {
        const config = require('./priceStorage.json');
        const data = JSON.stringify({
            params: params
        });
        const options = {
            hostname: config.url,
            path: '/price/update',
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

    /**
     * Calls price server to get price
     * @param bid
     * @param reference
     * @returns {Promise<unknown>}
     */
    get(bid, reference) {
        const config = require('./priceStorage.json');
        const data = JSON.stringify({
            bid: bid,
            reference: reference
        });
        const options = {
            hostname: config.url,
            path: '/price/get',
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

module.exports = PriceStorage;