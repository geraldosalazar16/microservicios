const accounts = require('../models/accounts');
var Authorization = require('../../libs/Authorization');
var IdGenerator = require('../../libs/IdGenerator');
var cipher = require('../../libs/cipherEngineServer');
const { sendMessages } = require('../../kafka');

// Create and Save a new account
exports.create = (req, res) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var title = req.body.title;
    var desc = req.body.desc;
    var type = req.body.type;
    var sub_type = req.body.sub_type;
    var username = req.body.username;
    var password = req.body.password;
    var payload = req.body.payload;

    // Authorization
    var authorized = Authorization.authorize('/ecomaccounts/add', { user_id, bid, type, sub_type });
    if (authorized.status === 'success') {

        // Generate credentials
        var credential_json = {
            username: username,
            password: password,
            payload: payload
        };
        var credential_string = JSON.stringify(credential_json);
        var request_id = IdGenerator.getNextId();
        var ciphered = cipher.encrypt(credential_string, request_id, "AES256");

        // Genrate new Random UUID 
        var FlakeIdGen = require('flake-idgen'),
            intformat = require('biguint-format'),
            generator = new FlakeIdGen();
        var idGenerator = generator.next();
        var uuid = intformat(idGenerator, 'dec');

        // Create a account
        const accountSchema = new accounts({
            account_id: uuid,
            type: type,
            sub_type: sub_type,
            title: title,
            desc: desc,
            credentials: ciphered.content,
            lockstore_ref: ciphered.reference,
            request_id: request_id,
            bid: bid,
        });

        accountMessage = {
            user_id: user_id,
            bid: bid,
            type: type,
            sub_type: sub_type,
            title: title,
            desc: desc,
            created_at: new Date(),
        }

        // Save account in th database
        accountSchema.save().then(data => {
            // Publish to kafka
            const kafkaMessage = JSON.stringify(Object.assign(accountMessage));
            sendMessages('social_account_added', kafkaMessage);
            res.status(200).send({
                status: 'Success',
                message: 'Account created'
            });
        }).catch(err => {
            res.status(500).send({
                status: "Failed",
                message: err.message || "Some error ocurred while creating the Account."
            });
        });
    } else {
        res.status(403).send('Not authorized');
    }
}

// Edits an account by account_id
exports.update = (req, res) => {

    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var account_id = req.body.account_id;
    var title = req.body.title;
    var desc = req.body.desc;
    var username = req.body.username;
    var password = req.body.password;
    var payload = req.body.payload;

    // Authorization
    var authorized = Authorization.authorize('/ecomaccounts/edit', { user_id, bid, account_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!account_id) {
            return res.status(400).send({
                status: 'Failed',
                message: "The account_id parameter cannot be empty"
            });
        } else {

            // Generate credentials
            var credential_string = JSON.stringify({
                username: username,
                password: password,
                payload: payload
            });
            var request_id = IdGenerator.getNextId();
            var ciphered = cipher.encrypt(credential_string, request_id, "AES256");

            accounts.findOne().
                where('account_id').equals(account_id).then(data => {
                    data.title = title,
                        data.desc = desc,
                        data.credentials = ciphered.content
                    data.save();
                    res.status(200).send({
                        status: 'Success',
                        message: "Account updated"
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while update the Account."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
}

// Delete an account 
exports.delete = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var account_id = req.body.account_id;

    // Authorization
    var authorized = Authorization.authorize('ecomaccounts/delete', { user_id, bid, account_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!account_id) {
            return res.status(400).send({
                status: 'Failed',
                message: "The account_id parameter cannot be empty"
            });
        } else {
            accounts.deleteOne().
                where('account_id').equals(account_id).then(data => {

                    accountMessage = {
                        user_id: user_id,
                        account_id: account_id,
                        bid: bid
                    }

                    const kafkaMessage = JSON.stringify(Object.assign(accountMessage));
                    sendMessages('social_account_deleted', kafkaMessage);
                    res.status(200).send({
                        status: 'Success',
                        message: 'Account has been deleted'
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while deleted the Account."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// List all accounts of business
exports.list = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;

    // Authorization
    var authorized = Authorization.authorize('/ecomaccounts/list', { user_id, bid });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid) {
            return res.status(400).send({
                status: 'Failed',
                message: "The bid parameter cannot be empty"
            });
        } else {
            accounts.find().
                where('bid').equals(bid).then(data => {
                    res.status(200).send({
                        status: 'Success',
                        message: "Account list",
                        data: data
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get all Account list."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// Get account with same ID
exports.getById = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var account_id = req.body.account_id;

    // Authorization
    var authorized = Authorization.authorize('/ecomaccounts/get:byId', { user_id, bid, account_id });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !account_id) {
            return res.status(400).send({
                status: 'Failed',
                message: "The bid and account_id parameter cannot be empty"
            });
        } else {
            accounts.findOne().
                where('bid').equals(bid).
                where('account_id').equals(account_id).then(data => {
                    var account = data;
                    var deciphered_credentials = JSON.parse(cipher.decrypt(account.credentials, account.request_id, account.lockstore_ref));
                    res.status(200).send({
                        status: 'Success',
                        message: "Account list",
                        data: {
                            account_id: account.account_id,
                            type: account.type,
                            subtype: account.subtype,
                            title: account.title,
                            desc: account.desc,
                            credentials: deciphered_credentials,
                            bid: bid
                        }
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get Account."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};

// Get account with same type.
exports.getByType = (req, res) => {
    var user_id = req.body.user_id;
    var bid = req.body.bid;
    var type = req.body.type;
    var sub_type = req.body.sub_type;

    // Authorization
    var authorized = Authorization.authorize('/ecomaccounts/get:byType', { user_id, bid, type, sub_type });
    if (authorized.status === 'success') {
        // Validate request
        if (!bid || !type || !sub_type) {
            return res.status(400).send({
                status: 'Failed',
                message: "The bid, type and sub_type parameter cannot be empty"
            });
        } else {
            accounts.findOne().
                where('type').equals(type).
                where('sub_type').equals(sub_type).
                where('bid').equals(bid).then(data => {
                    var account = data;
                    var deciphered_credentials = JSON.parse(cipher.decrypt(account.credentials, account.request_id, account.lockstore_ref));
                    res.status(200).send({
                        status: 'Success',
                        message: "Account list",
                        data: {
                            account_id: account.account_id,
                            type: account.type,
                            subtype: account.subtype,
                            title: account.title,
                            desc: account.desc,
                            credentials: deciphered_credentials,
                            bid: bid
                        }
                    });
                }).catch(err => {
                    res.status(500).send({
                        status: "Failed",
                        message: err.message || "Some error ocurred while get Account."
                    });
                });
        }
    } else {
        res.status(403).send('Not authorized');
    }
};
