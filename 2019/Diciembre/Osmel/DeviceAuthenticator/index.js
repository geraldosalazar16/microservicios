var express = require('express');
var http = require('http');
var crypto = require("crypto");
var body_parser = require('body-parser');
const fs = require('fs');
var app = express();
var deviceToken = require('./libs/DeviceTokenRepoLib/DeviceTokens');

/**
 * Returns the server identity file.
 */
app.post('/server/getIdentity', (req, res) => {
    var user_id = fs.readFileSync('./identity/server.id');
    res.status(200).send(user_id);
});

app.use(body_parser.urlencoded({ extended: true }));

/**
 * Create a session for requested device.
 * @param {string} dev_serial
 * @param {string} dev_identity
 * @param {Object} secured
 * @param {string} payload
 */
app.post('/devices/createSession', (req, res) => {
    var deviceIdentities = require('./libs/DeviceIdentitiesClient/DeviceIdentities');

    const pvtKey = fs.readFileSync("./keys/pvt.key", "utf8");
    const privateKey = "-----BEGIN RSA PRIVATE KEY-----\n" +
        pvtKey +
        "\n-----END RSA PRIVATE KEY-----";

    var dev_serial = req.body.dev_serial;
    var dev_identity = req.body.dev_identity;
    var secured = req.body.secured;
    var payload = req.body.payload;

    // Verify Identity
    verifyIdentity = deviceIdentities.verify(dev_serial, dev_identity);
    if (verifyIdentity == 'failed') {
        res.status(403).send('Error');
    } else if (verifyIdentity == 'success') {

        const payload_buffer = Buffer.from(payload, 'base64');

        // RSA_Descrypt
        const payload_json = JSON.parse(crypto.privateDecrypt(privateKey, payload_buffer));

        const algorithm = 'aes-192-cbc';

        var skey = payload_json.skey;
        var iv = payload_json.iv;

        // AES_Descrypt
        var device_nonce = decryptAes(payload_json.nonce, skey, iv, algorithm);

        var return_nonce = device_nonce + 10;

        var server_nonce = Math.floor(Math.random() * 99999999);

        const response_payload = JSON.stringify({
            return_nonce: return_nonce,
            server_nonce: server_nonce
        });
        console.log(response_payload);

        const buffData = new Buffer.from(enc_response_payload);

        var enc_response_payload = crypto.publicEncrypt(dev_identity.pubKey, buffData).toString('base64');

        var session_id = deviceToken.createSession(dev_id, dev_identity.dev_serial, dev_identity.dev_usage, dev_identity.dev_type,
            dev_identity.group_id, server_nonce, secured, skey, iv);

        const response = JSON.stringify({
            session_id: session_id,
            payload: enc_response_payload
        });
        res.status(200).send(response);
    }
})

/**
 * Authenticated the device and returns the access token
 * @param {string} dev_serial
 * @param {string} session_id
  * @param {string} payload
 */
app.post('/devices/authenticate', (req, res) => {
    var dev_serial = req.body.dev_serial;
    var session_id = req.body.session_id;
    var payload = req.body.payload;

    var session = deviceToken.getSession(session_id, dev_serial);

    var algorithm = 'aes-192-cbc';

    // AES_Descrypt
    const payload_json = JSON.parse(decryptAes(payload, session.skey, session.iv, algorithm));

    var session_nonce = payload_json.nonce - 10;

    if (session_nonce != session.nonce) {
        res.status(403).send('Not Allowed');
    } else if (session_nonce == session.nonce) {

        var token_info = deviceToken.createToken(session.dev_id, session.dev_serial, session.dev_usage,
            session.dev_type, session.group_id, session.secured, session.skey, session.iv, Config.tokenLife);

        const response_json = JSON.stringify({
            access_token: token_info.access_token,
            refresh_token: token_info.refresh_token,
            expired: token_info.expired
        });

        var response = encryptAes(response_json, session.skey, session.iv, algorithm).toString('base64');

        res.status(200).send(response);
    }
});


/**
 * For AES_ENCRYPT
 * @param {Object | string} toEncrypt
 * @param {Buffer} skey
 * @param {Buffer} iv
 * @param {string} algorithm
 */
function encryptAes(toEncrypt, skey, iv, algorithm) {
    var cipher = crypto.createCipheriv(algorithm, skey, iv)
    var encrypted = cipher.update(toEncrypt, 'utf8', 'hex')
    encrypted += cipher.final('hex');
    return {
        content: encrypted,
    };
}

/**
 * For AES_DESCRYPT
 * @param {Object | string} toEncrypt
 * @param {Buffer} skey
 * @param {Buffer} iv
 * @param {string} algorithm
 */
function decryptAes(toDecrypt, skey, iv, algorithm) {
    var decipher = crypto.createDecipheriv(algorithm, skey, iv)
    var dec = decipher.update(toDecrypt.content, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

const port = normalizePort(process.env.PORT || '8001');
http.createServer(app).listen(8021, () => {
  console.log(`Server started at http://localhost:${port}`);
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}