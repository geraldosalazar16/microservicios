'use strict';

const fs = require('fs');
const http = require('http');

class Authorization {
    /**
     * Class constructor
     * @example var Authorization = new Authorization()
     */
    constructor(){}
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
     * Check if the configuration JSOn contains all the required fields
     * @param {Object} config 
     */
    isValidConfig(config) {
        return config.url && config.clientId && config.clientSecret;
    }

    /**
     * Saves the configuration into authorizationServer.json
     * @param {Object} json 
     */
    saveJSON(json) {
        let data = JSON.stringify(json);
        fs.writeFileSync('authorizationServer.json', data);
    }

    /**
     * Calls Authorization server to authorize an access.
     * @param {String} appId 
     * @param {Object} params 
     */
    authorize(appId, params) {
        // read config
        const config = require('./authorizationServer.json');
        const data = JSON.stringify({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            appId: appId,
            params: params
        })

        const options = {
            hostname: config.url,
            path: '',
            method: 'POST',
            port: '3001',
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

module.exports = Authorization;