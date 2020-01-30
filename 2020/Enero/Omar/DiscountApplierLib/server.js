const http = require('http');
const DiscountApplier = require('./DiscountApplier');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    var discount = new DiscountApplier();
    discount.init('./DiscounteApplierLib.json');

    discount.apply("11", "aaa", "asas")
        .then(data => {
            console.log(data);
            res.end('Finalizado');
        })
        .catch(error => {
            console.log(error);
            res.end('Error');
        })
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
