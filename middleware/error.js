// modules
const { asyncLogger } = require('../startup/logger');

module.exports = function(err, req, res, next) {
    asyncLogger.error(err.message, { stack: err.stack }); // logging exceptions
    res.status(500).send('Something went wrong!'); // error message for the client
}