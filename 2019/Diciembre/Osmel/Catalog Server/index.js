var express = require('express');
var body_parser = require('body-parser');

// Create express app
var app = express();

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(body_parser.urlencoded({ extended: true }));

// Parse requests of content-type - application/json
app.use(body_parser.json());

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Require routes
require('./app/routes/catalog.routes')(app);
require('./app/routes/catalog_set.routes')(app);
require('./app/routes/filter.routes')(app);


const port = normalizePort(process.env.PORT || '8001');
app.listen(8021, () => {
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