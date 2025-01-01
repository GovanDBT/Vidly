// modules
const express = require('express');
const auth = require('../routes/auth');
const users = require('../routes/users');
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const error = require('../middleware/error');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const customers = require('../routes/customers');

module.exports = function(app) {
    // Routes and middleware handler
    app.use(express.json()); // json middleware
    app.use('/api/auth', auth); // login
    app.use('/api/users', users); // users
    app.use('/api/genres', genres); // genres
    app.use('/api/movies', movies); // movies
    app.use('/api/rentals', rentals); // rentals
    app.use('/api/returns', returns); // returns
    app.use('/api/customers', customers); // customers
    app.use(error); // error middleware handler
}