const http = require('http');
const Authorization = require('./Authorization.js');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  const auth = new Authorization();
  auth.init('./initial.json');
  auth.authorize('appId', {prop1: 1, prop2: 2})
  .then(data => {
    console.log(data);
    res.end('Terminado');
  })
  .catch(error => {
    console.log(error);
      res.end('Error');
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});