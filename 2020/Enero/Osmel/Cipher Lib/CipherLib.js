'use strict';

const http = require('http');

class CipherLib {
    /**
     * Class constructor
     * @example var CipherLib = new CipherLib()
     */
    constructor() { }
    /**
     * Function Cipher server to perform encryption operation.
     * @param {Object} params JSON object with the configuration parameters 
     */
    encrypt(params) {
        const cipherLib = require('./CipherLib.json');
        const data = JSON.stringify({
            clientId: cipherLib.clientId,
            clientSecret: cipherLib.clientSecret,
            params: params
        });
        const options = {
            hostname: cipherLib.url,
            path: '/enginge/encrypt',
            method: 'POST',
            port: '8001',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };     
        this.calls(options, data);
    }

     /**
     * Function Cipher server to perform decryption operation.
     * @param {Object} params JSON object with the configuration parameters 
     */
    decrypt(params) {
        const cipherLib = require('./CipherLib.json');
        const data = JSON.stringify({
            clientId: cipherLib.clientId,
            clientSecret: cipherLib.clientSecret,
            params: params
        });
        const options = {
            hostname: cipherLib.url,
            path: '/enginge/decrypt',
            method: 'POST',
            port: '8001',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };     
        this.calls(options, data);
    }

    /**
     * Calls CIPHER_SERVER_URL to perform encryption or decryption operation.
     * @param {Object | String} options JSON object with the options parameters 
     * @param {Object | String} data Can be a JSON object with the data parameters 
     */
    calls(options, data){
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

module.exports = CipherLib;