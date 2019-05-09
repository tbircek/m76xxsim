/* 
 * logger.js
 *
 * Author: Turgay Bircek
 * Version: 1.0.0
 * Date: 01/23/2019
 * 
 * Provides a logger module.
 *
 */

const fs = require('fs');
const path = require('path');
// var rfs = require('rotating-file-stream');
// const winston = require('winston');
const { transports, createLogger, format } = require('winston');
const logDirectory = path.join(__dirname, 'public/logs');
// const fileName = path.join(logDirectory, 'logfile.log');

try {
  // ensure log directory exists
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
}
catch (e) {
  console.error('failed to create log folder.\nrun "npm test"', e.message);
}

var options = {
  logFile: {
    level: 'info',
    filename: path.join(logDirectory, 'app.log'),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    localTime: true
  },
  // errFile: {
  //   level: 'error',
  //   filename: path.join(logDirectory, 'error.log'),
  //   handleExceptions: true,
  //   json: true,
  //   maxsize: 524288, // 500KB
  //   maxFiles: 10,
  //   colorize: true,
  //   localTime: true
  // },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
    localTime: true
  },
};

//
// Create a new winston logger instance with tranport: File
// add Console in later if development is enabled.
//
const logger = createLogger({
  // format: winston.format.printf(info => `${info.message}`),
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    format.printf(info => `${info.timestamp} ${info.message}`)
  ),
  defaultMeta: { service: 'm76xxsim' },
  transports: [
    new transports.File(options.logFile),
    // new transports.File(options.errFile)
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDirectory, 'exceptions.log') })
  ]
});

// console only available in development.
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console(options.console));
}

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};

module.exports = logger;
