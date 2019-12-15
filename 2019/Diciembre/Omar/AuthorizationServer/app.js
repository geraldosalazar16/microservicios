var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');


var clientRouter = require('./routes/client.router');

var app = express();

// base de datos
var mongoDB = 'mongodb://127.0.0.1/samin';
mongoose.connect(mongoDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).catch((error) => console.log(error));
mongoose.Promise = global.Promise;

var db = mongoose.connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// MIDDLEAWARE
/*const keyValid = require('./controllers/clients.middleawares').validKey;

app.use(keyValid);*/


module.exports = ({masterId, masterSecret}) => {
    try {
        const config = readConfig();
        const gen = hashSha512(masterSecret);
    } catch (error) {
        return false;
    }
}


/**
 * Leer la configuracion desde el archivo de config.json
 */
function readConfig() {
    return require('./config.json');
}



app.use('/clients', clientRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
