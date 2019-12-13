'use strict';

const fs = require('fs');
const http = require('http');
const configFile = 'actionTokensRepo.json';

class ActionTokens {
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
        fs.writeFileSync(configFile, data);
    }

    /**
     * Calls Token Repository server to create a new token.
     * @param {*} limited 
     * @param {*} max 
     * @param {*} user_id 
     * @param {*} purpose 
     * @param {*} payload 
     * @param {*} expires 
     */
    createStandard(limited, max, user_id, purpose, payload, expires) {
        const data = {
            limited,
            max,
            user_id,
            purpose,
            payload,
            expires,
            endpoint: '/token/createNumeric'
        };
        this.callServer(data);
    }

    /**
     * Calls Token Repository server to create a new token.
     * @param {*} limited 
     * @param {*} max 
     * @param {*} user_id 
     * @param {*} purpose 
     * @param {*} payload 
     * @param {*} expires 
     */
    createAlphabetic(limited, max, user_id, purpose, payload, expires) {
        const data = {
            limited,
            max,
            user_id,
            purpose,
            payload,
            expires,
            endpoint: '/token/createAlphabetic'
        };
        this.callServer(data);
    }

    /**
     * Calls Token Repository server to create a new token.
     * @param {*} limited 
     * @param {*} max 
     * @param {*} user_id 
     * @param {*} purpose 
     * @param {*} payload 
     * @param {*} expires 
     */
    createAlphanumeric(limited, max, user_id, purpose, payload, expires) {
        const data = {
            limited,
            max,
            user_id,
            purpose,
            payload,
            expires,
            endpoint: '/token/createAlphanumeric'
        };
        this.callServer(data);
    }

    /**
     * Calls Token Repository server to verify and use a token.
     * @param {*} user_id 
     * @param {*} token 
     * @param {*} purpose 
     */
    use(user_id, token, purpose) {
        const data = {
            user_id,
            token,
            purpose,
            endpoint: '/token/use'
        };
        this.callServer(data);
    }

    /**
     * Calls the server.
     * @param {Object} params 
     */
    callServer(endpoint, params) {
        // read config
        const config = require(`./${configFile}`);
        const data = JSON.stringify({
            clientId: config.clientId,
            clientSecret: config.clientSecret,
            ...params
        })

        const options = {
            hostname: `${config.url}${endpoint}`,
            path: '',
            method: 'POST',
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

module.exports = ActionTokens;