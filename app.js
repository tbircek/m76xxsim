var express = require('express');
var createError = require('http-errors');
var path = require('path');
var morgan = require('morgan');
var winston = require('./winston');
var helmet = require('helmet');
var favicon = require('serve-favicon');
var indexRouter = require('./routes/index');
var compression = require('compression');

// format app.log file output for easy reading.
morgan.token('message', function getBreakerMolde(req, res) {
  var message = `\tbreakerModel: ${req.query.breakerModel}\tstartPosition: ${req.query.startPosition}\toperationMode: ${req.query.operationMode}\tcloseOperationDelay: ${req.query.closeOperationDelay}\ttripOperationDelay: ${req.query.tripOperationDelay} --- `;
  return message;
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Compress all routes
app.use(compression());
app.use(helmet());
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

app.use(morgan(':method :message :response-time', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
