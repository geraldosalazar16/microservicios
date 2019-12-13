'use strict';

const fs = require('fs');
const http = require('http');

class FileStorage {
    /**
     * Class constructor
     * @example var FileStorage = new FileStorage()
     */
    constructor() { }
    /**
     * Initializes the token repo 
     * @param {Object | String} params Can be a JSON object with the configuration parameters or
     * a path to the json config file
     */
    init(params) {
        // Check parameter type
        let config = {};
        // If it is a string, then I should try to load the file
        if (Object.prototype.toString.call(params) === '[object String]') {
            config = require(params);
        } else {
            // If is not a string then it should be a JSON
            config = params;
        }
        // Check tath is has all the parameters
        if (this.isValidConfig(config)) {
            this.saveJSON(config);
        }
    }

    /**
     * Check if the configuration JSON contains all the required fields
     * @param {Object} config 
     */
    isValidConfig(config) {
        return config.url && config.clientId && config.clientSecret;
    }

    /**
     * Saves the configuration into fileStorage.json
     * @param {Object} json 
     */
    saveJSON(json) {
        let data = JSON.stringify(json);
        fs.writeFileSync('fileStorage.json', data);
    }

    /**
     * Calls File Storage server to upload a file
     * @param {Object} params 
     */
    upload(params) {
        const config = require('./fileStorage.json');
        const data = JSON.stringify({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            params: params
        });
        const options = {
            hostname: config.url,
            path: '/upload',
            method: 'POST',
            port: '8001',
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
    * Calls File Storage server to publish a file.
    * @param {Object} params  
    */
    publish(params) {
        const config = require('./fileStorage.json');
        const data = JSON.stringify({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            params: params
        });
        const options = {
            hostname: config.url,
            path: '/publish',
            method: 'POST',
            port: '8001',
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
    * Calls File Storage server to get query key
    * @param {Object} params  
    */
    getQueryKey(params) {
        const config = require('./fileStorage.json');
        const data = JSON.stringify({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            params: params
        });
        const options = {
            hostname: config.url,
            path: '/getQueryKey',
            method: 'POST',
            port: '8001',
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
    * Calls File Storage server to get query key
    * @param {Object} params  
    */
    list(params) {
        const config = require('./fileStorage.json');
        const data = JSON.stringify({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            params: params
        });
        const options = {
            hostname: config.url,
            path: '/list',
            method: 'POST',
            port: '8001',
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

module.exports = FileStorage;