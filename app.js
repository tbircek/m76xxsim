var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var settingsRouter = require('./routes/settings');

var app = express();

// provide access to database.
const options = {
  autoIndex: false, // Don't build indexes
  reconnectTries: 100, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
var mongoose = require('mongoose');
// var mongoDB = 'mongodb://localhost/m76xxsim';
// mongoose.connect('mongodb://localhost/m76xxsim_strings', options);
mongoose.connect('mongodb://localhost/local', options);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', function() {
  console.error.bind(console, 'connection error.');
  mongoose.connection.close();
});
db.once('open', function () {
  console.log('connected to ' + mongoose.version);
});
// db.collection('m76xsimm').insertMany([  
//   { name: "title", value: "Recloser Simulator" },
//   { name: "version", value: "2018.6.11" },
//   { name: "inputLabel", value: "Input Settings" },
//   { name: "outputLabel", value: "Output Settings" },
//   { name: "breakerModel", value: "Breaker Model" },
//   { name: "delayTime", value: "Delay Time" },
//   { name: "durationTime", value: "Duration Time" },
//   { name: "input1Label", value: "Input 1: " },
//   { name: "input2Label", value: "Input 2: " },
//   { name: "52aDelayLabel", value: "52a delay: " },
//   { name: "52bDelayLabel", value: "52b delay: " },
//   { name: "output1Label", value: "Output 1: " },
//   { name: "output2Label", value: "Output 2: " },
//   { name: "tripPulseLabel", value: "Trip pulse: " },
//   { name: "closePulseLabel", value: "Close pulse: " },
//   { name: "timeUnitLabel", value: "msec" },
//   { name: "author", value: "Turgay Bircek" },
//   { name: "description", value: "Recloser simulator for Beckwith Electric Protection relays." },
//   { name: "keywords", value: "recloser, simulator, protection relays, 52a, 52b, trip, close." },
//   { name: "company", value: "Beckwith Electric Co. Inc." },
//   { name: "copyright", value: "&copy;2018 " },
//   { name: "address", value: "6190 118th Ave. North Largo, FL 33773" },
//   { name: "phone", value: "Ph: (727) 544-2326" },
// ]);
// mongoose.connection.close();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/settings', settingsRouter);

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
