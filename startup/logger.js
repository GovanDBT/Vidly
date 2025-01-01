/** This logger is for handling error messages from the DB, our application and express */

// Modules
const { createLogger, format, transports } = require('winston');
const winston = require('winston'); 
require('winston-mongodb');
const { combine, timestamp, printf } = format;

// Custom log format to show error location
const logFormat = printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} [${level}]: ${message} \n Stack Trace: ${stack || 'N/A'} \n`;
});

// config logger for Express error messages - deals with async errors
const asyncLogger = createLogger({
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(), // log to console
    new transports.File({ filename: 'errors.log' }), // log to file
    new winston.transports.MongoDB({db:'mongodb://localhost/vidly', level: 'error'}) // log to db
  ]
});

// Config logger for sync errors
const logger = winston.createLogger({
  level: 'info', // Log at info level and above
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'uncaughtExceptions.log', level: 'error' }), // log to file
    new winston.transports.MongoDB({db:'mongodb://localhost/vidly', level: 'error'}) // log to db
  ]
});

exports.asyncLogger = asyncLogger;
exports.logger = logger;