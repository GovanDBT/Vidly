// modules
const mongoose = require('mongoose');
const { logger } = require('./logger');
const config = require('config');

module.exports = function() {
  // connect to MongoDB
  const db = config.get('db');
  mongoose.connect(db)
    .then(() => logger.info(`Connected to ${db}...`)) // Log connection success
    .catch(err => logger.error(`Could not connect to ${db}...`, err)); // Log connection error
};
