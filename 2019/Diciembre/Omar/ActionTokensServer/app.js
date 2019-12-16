var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var redis = require('redis');
const validateCredentials = require('./helpers/config');
const validateBody = require('./helpers/body');


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
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    const validationBody = validateBody(req.body);

    if (validationBody.status === 'failed') {
        res.status(400).send(validationBody);
    } else {
        try {
            const clientInfo = validationBody.body;

            if (validateCredentials(clientInfo)) {
                next();
            } else {
                console.log('Invalid credentials provided');
                res.status(400).send({
                    status: 'failed',
                    message: 'Invalid credentials provided'
                });
            }
        } catch (e) {

        }
    }
});


// redis
/*var configRedis = require('./validators.json');
var clientRedis = redis.createClient();

for (let i = 0; i < configRedis.validators.length; i++) {
    clientRedis.set(
        configRedis.validators[i].id
    );
}
*/


var clientRouter = require('./routes/client.router');
var rulesRouter = require('./routes/rules.router');
var authorizationRouter = require('./controllers/authorization.controller')

app.use('/clients', clientRouter);
app.use('/rules', rulesRouter);
app.use('/authorization', authorizationRouter)

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
