// Modules
const { Movie, validate } = require('../models/movieModel');
const { Genre } = require('../models/genreModel');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

// HTTP Get request - retrieve all movies
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

// retrieves movie with a specific id
router.get('/:id', [auth, admin], async (req, res) => {
    const movie = await Movie.findById(req.params.id); // look for a movie

    // if the movie does not exit then
    if (!movie) { return res.status(404).send('Movie with the given ID does not exist'); }

    res.send(movie); // response
})

// HTTP Post request - create a new movie
router.post('/', [auth, admin], async (req, res) => {
    const { error } = validate(req.body); // validate input coming from the client

    if(error) { return res.status(400).send(error.details[0].message); } // if validation error

    const genre = await Genre.findById(req.body.genreId); // look for the movies genre

    // if the movies genre does not exit then
    if (!genre) return res.status(404).send('Genre with the given ID does not exist');

    // define a new movie
    const movie = new Movie({ 
        title: req.body.title,
        genre: {
            _id: genre._id,
            genre: genre.genre
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    await movie.save(); // save movie to DB

    res.send(movie); // response
});

// HTTP Put request - updating movies
router.put('/:id', [auth, admin], async (req, res) => {
    const { error } = validate(req.body); // check if client input validation is correct

    if(error) { return res.status(400).send(error.details[0].message); } // if input validation fails, then

    const genre = await Genre.findById(req.body.genreId); // look for the movies genre

    // if the movies genre does not exit then
    if (!genre) { return res.status(404).send('Genre with the given ID does not exist'); }

    // look for movie and update it
    const movie = await Movie.findByIdAndUpdate(req.params.id, { 
        title: req.body.title,
        genre: {
            _id: genre._id,
            genre: genre.genre
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

    // if the movie does not exit then
    if (!movie) { return res.status(404).send('Movie with the given ID does not exist'); }

    res.send(movie); // response
});

// HTTP Delete request - deleting a movie
router.delete('/:id', [auth, admin], async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id); // look for the movie and delete them

    // if the movie does not exit then
    if (!movie) { return res.status(404).send('Customer with the given ID does not exist'); }

    res.send(movie); // response
});

module.exports = router;