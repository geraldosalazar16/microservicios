var express = require('express');
var body_parser = require('body-parser');

// Create express app
var app = express();

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(body_parser.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
app.use(body_parser.json());

// Configuring the database
// const dbConfig = require('./config/database.config.js');
// var Knex = require('knex')(dbConfig);
// var Bookshelf = require('bookshelf')(Knex);


// Connecting to the database
// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err);
//         return;
//     } else {
//         console.log('Successfully connected to the database');
//     }
// });
// connection.end();

// Require routes
require('./app/routes/channel_employees.routes')(app);



const port = normalizePort(process.env.PORT || '8001');
app.listen(port, () => {
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