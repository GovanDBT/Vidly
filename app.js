// modules
const express = require('express');
const app = express(); // call express
const { logger } = require('./startup/logger');

require('./startup/exceptionLogger')(); // exception handler
require('express-async-errors'); // dealing with async errors
require('./startup/routes')(app); // load middlewares
require('./startup/db')(); // load DB module
require('./startup/config')(); // load config setting
require('./startup/validation')(); // load validation module
require('./startup/prod')(app); // load production middlewares

// environmental variable - PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, () => logger.info(`listening on port ${port}`));

module.exports = server;