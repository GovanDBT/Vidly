// Modules
const { Rental, validate } = require('../models/rentalModel');
const { Customer } = require('../models/customerModel');
const { Movie } = require('../models/movieModel');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// HTTP Get -- retrieves a list of all rentals
router.get('/', [auth, admin], async (req, res) => {
    const rental = await Rental.find().sort('-dateOut');
    res.send(rental);
});

// HTTP POST -- create a new rental
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body); // validate input coming from the client

    if(error) { return res.status(400).send(error.details[0].message); } // if validation error

    const customer = await Customer.findById(req.body.customerId); // look for the customer
    // if the customer does not exit then
    if (!customer) return res.status(404).send('Customer with the given ID does not exist');

    const movie = await Movie.findById(req.body.movieId); // look for the movie
    // if the movies does not exit then
    if (!movie) return res.status(404).send('Movie with the given ID does not exist');

    // check to see if the movie is in stock
    if (movie.numberInStock === 0) return res.status(400).send('Movie is out of Stock');

    const session = await mongoose.startSession();

    session.startTransaction();
    try {

        // Create a new rental
        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });

        // Save the rental with the session
        await rental.save({ session });

        // Update movie stock
        await Movie.updateOne(
            { _id: movie._id }, 
            { $inc: { numberInStock: -1 } }, 
            { session }
        );

        // commit the transaction
        await session.commitTransaction();

        // End the session
        session.endSession();

        // Respond with the rental 
        res.send(rental);

    } catch (error) {

        // Abort the transaction if something went wrong
        await session.abortTransaction();
        session.endSession();

        // Log the specific error for debugging
        console.error("Transaction error:", error);

        res.status(500).send("Something went wrong.");
    }

    

    // // define a new rental
    // let rental = new Rental({
    //     customer: {
    //         _id: customer._id,
    //         name: customer.name,
    //         phone: customer.phone
    //     },
    //     movie: {
    //         _id: movie._id,
    //         title: movie.title,
    //         dailyRentalRate: movie.dailyRentalRate
    //     }
    // });

    // try {
    //     // create a task object that is like a transaction
    //     // operations defined under will be treated as a single unit
    //     new Fawn.Task()
    //         .save('rentals', rental) // 'rentals' from the DB collection
    //         .update('movies', { _id: movie._id }, { // in the movies collection, with the given ID, decrement numberInStock by 1
    //             $inc: { numberInStock: -1 }
    //         })
    //         .run()
        
    //     res.send(rental); // show results
    // }
    // catch(ex) {
    //     res.status(500).send('Something Failed.');
    // }
    

    
});

module.exports = router;

