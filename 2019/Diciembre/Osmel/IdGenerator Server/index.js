var express = require('express')
var http = require('http')
var app = express()
var config = require('./config.json')
var crypto = require('crypto');

/**
 * Endpoint for Generates next random ID
 * @param {string} masterId 
 * @param {string} masterSecret 
 */
app.get('/random/next', (req, res) => {
  var masterSecret = req.query.masterSecret;
  var masterId = req.query.masterId;

  var hashedMasterSecret = crypto.createHash('sha256')
    .update(masterSecret)
    .digest('hex');

  if (hashedMasterSecret == config.masterSecret && masterId == config.masterId) {
    var FlakeIdGen = require('flake-idgen'),
      intformat = require('biguint-format'),
      generator = new FlakeIdGen();

    var idGenerator = generator.next()

    var uuid = intformat(idGenerator, 'dec');

    const data = JSONStringuify()
    res.status(200).send(uuid);
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