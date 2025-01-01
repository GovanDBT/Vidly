/**
 * A route handler for returning a movie
 */
const express = require('express');
const { Rental } = require('../models/rentalModel');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate'); // input validation middleware
const Joi = require('joi'); // joi library for input validation
const { Movie } = require('../models/movieModel'); // user model
const router = express.Router();

/**
 * @api {post} /api/returns - Return a movie
 */
router.post('/', [auth, validate(validateReturns)], async (req, res) => {
    // looks for rental with the customer and movie id
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    // if no rental found then return 404
    if (!rental) return res.status(404).send('Rental not found');

    // if rental already processed then return 400
    if(rental.dateReturned) return res.status(400).send('Return already processed');

    rental.return(); // return rental

    await rental.save(); // save rental

    await Movie.findByIdAndUpdate({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 } // increment movie stock
    });

    return res.send(rental); // return rental
});

// input validation
function validateReturns(req) {
    // define schema
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    // validate schema
    return schema.validate(req);
}

module.exports = router; // export router for use in other files