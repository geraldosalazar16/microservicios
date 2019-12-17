var express = require('express');
var http = require('http');
var path = require('path');
var body_parser = require('body-parser');
const fs = require('fs');
var app = express();
const NodeRSA = require('node-rsa');
const key = new NodeRSA({ b:512 });

app.use(body_parser.urlencoded({ extended: true }));

app.post('/server/getIdentity', (req, res) => {
    var user_id = require('./identity/server.id');
    res.status(200).send(user_id);
});

app.post('/devices/createSession', (req, res) => {
    var deviceIdentities = require('./libs/DeviceIdentitiesClient/DeviceIdentities');
    const pvtKey = fs.readFileSync(path.resolve('./keys/pvt.key'));

    var dev_serial = req.body.dev_serial;
    var dev_identity = req.body.dev_identity;
    var secured = req.body.secured;
    var payload = req.body.payload;

    verifyIdentity = deviceIdentities.verify(data.dev_serial, data.dev_identity);
    if (verifyIdentity == 'failed') {
        res.status(403).send('Error');
    } else if (verifyIdentity == 'success') {
    var payload_json = key.decrypt(payload, pvtKey);

    res.status(200).send(payload_json);
    }
});

app.post('/devices/authenticate', (req, res) => {
    res.status(200).send('authenticate');
});

http.createServer(app).listen(8021, () => {
    console.log('Server started at http://localhost:8001');
});