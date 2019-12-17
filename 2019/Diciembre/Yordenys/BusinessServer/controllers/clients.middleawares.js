'use strict';

const fs = require('fs');
const crypto = require('crypto');
var hash = crypto.createHash('sha512');

const middlewares = {


    validConfig: function (req, res, next) {
        const config = this.readConfig();
        console.log(config);
        return true;
    }

    /*validKey: function (req, res, next) {
        fs.readFile('config.json', 'utf8', (error, data) => {
            if (error) {
                res.status(201).json({
                    status: 201,
                    message: "Error reading file {config.json}, " + error.message
                });
            }

            // Reading the JSON object
            const config = JSON.parse(data);

            // Validating the user ID and secret key
            if (req.body.masterId === config.masterId) {
                console.log(hash.update(data.masterSecret).digest());

                if (req.body.masterSecret === hash.update(data.masterSecret, 'utf-8').digest('hex')) {
                    return next();
                } else {
                    res.status(201).json({
                        status: 201,
                        message: "Please enter valid secret {masterSecret}"
                    });
                }
            } else {
                res.status(201).json({
                    status: 201,
                    message: "Please enter valid user ID {masterId}"
                });
            }
        });
    }*/

};

module.exports = middlewares;