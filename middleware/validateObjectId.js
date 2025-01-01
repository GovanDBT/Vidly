/**
 * This middleware checks if the ID passed in the request is a valid ObjectId.
 * If the ID passed is invalid, it returns a 404 status code.
 * else, it passes control to the next middleware function.
 */

const mongoose = require('mongoose');

module.exports = function(req, res, next) {
    // checks if ObjectId is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID.');

    next(); // pass control to the next middleware function
}