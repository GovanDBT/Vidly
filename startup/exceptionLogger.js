/** This logger is for handling uncaught exceptions and rejected or unhandled promises
 * outside the context of express. It will terminate the application if an error
 * occurs
 */

// modules
const winston = require('winston'); 

module.exports = function() {
    // Configure Winston to handle uncaught exceptions and unhandled rejections
    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({filename: 'uncaughtExceptions.log'})
    );
};