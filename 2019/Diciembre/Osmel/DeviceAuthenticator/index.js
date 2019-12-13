var express = require('express');
var http = require('http');
var app = express();
const fs = require('fs');

app.post('/server/getIdentity', (req, res) => {
    // var user_id = require('./identity/server.id');
    res.status(200).send(user_id);
});

app.post('/devices/createSession', (req, res) => {
    var deviceIdentities = require('./libs/DeviceIdentitiesClient/DeviceIdentities');

    const data = JSON.stringify({
        dev_serial: req.query.dev_serial,
        dev_identity: req.query.dev_identity,
        secured: req.query.secured,
        payload: req.query.payload
    });

    verifyIdentity = deviceIdentities.verify(data.dev_serial, data.dev_identity);
    if (verifyIdentity == 'failed') {
        res.status(403).send('Error');
    }  else if(verifyIdentity == 'success') {
        payload_json = RSA_DECRYPT(data.payload);
        fs.writeFileSync('payload_json.skey', payload_json);
        res.status(200).send('createSession');
    }
});

app.post('/devices/authenticate', (req, res) => {
    res.status(200).send('authenticate');
});

http.createServer(app).listen(8021, () => {
    console.log('Server started at http://localhost:8001');
});