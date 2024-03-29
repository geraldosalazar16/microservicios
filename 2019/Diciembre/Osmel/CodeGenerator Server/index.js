var express = require('express');
var http = require('http');
var app = express();
var config = require('./config.json');
var crypto = require('crypto');
var body_parser = require('body-parser');

app.use(body_parser.urlencoded({ extended: true }));

/**
 * Endpoint for Generates next unique code
 * @param {string} masterId
 * @param {string} masterSecret
 * @param {string} base_string
 */
app.post('/code/next', (req, res) => {
    var masterSecret = req.body.masterSecret;
    var masterId = req.body.masterId;
    var base_string = req.body.base_string;

    var hashedMasterSecret = crypto.createHash('sha256')
        .update(masterSecret)
        .digest('hex');

    if (hashedMasterSecret == config.masterSecret && masterId == config.masterId) {
        var firstFourBase_string = base_string.substring(0, 4);
        var hashedBase_string = crypto.createHash('md5')
            .update(base_string)
            .digest('hex');
        var lastEightMd5Base_string = hashedBase_string.substr(hashedBase_string.length - 8);
        var code = firstFourBase_string + '-' + lastEightMd5Base_string;
        ;
        res.status(200).send(code);
    } else {
        res.status(403).send('Unauthorized');
    }
})

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