// Modules
const { Genre, validate } = require('../models/genreModel');
const validateObjectId = require('../middleware/validateObjectId');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();

// HTTP Get request - retrieve all genre
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('genre');
    res.send(genres);
});

// retrieves genres with a specific id
router.get('/:id', validateObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id); // look for genre

    // if the genre does not exit then
    if (!genre) {
        return res.status(404).send('Genre with the given ID does not exist');
    }

    res.send(genre); // response
});

// HTTP Post request - create a genre
router.post('/', auth, async (req, res) => {
    // validate input coming from the client
    const { error } = validate(req.body);

    // if validation error
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    // define a new genre
    const genre = new Genre({ genre: req.body.genre });

    await genre.save(); // save genre to DB

    res.send(genre); // response
});

// HTTP Put request - updating genre
router.put('/:id', [auth, admin], async (req, res) => {
    // check if client input validation is correct
    const { error } = validate(req.body);

    // if input validation fails, then
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    // look for genre and update it
    const genre = await Genre.findByIdAndUpdate(req.params.id, { genre: req.body.genre }, { new: true });

    // if the genre does not exit then
    if (!genre) {
        return res.status(404).send('Genre with the given ID does not exist');
    }

    res.send(genre); // response
});

// HTTP Delete request - deleting a genre
router.delete('/:id', [auth, admin], async (req, res) => {

    // look for genre and delete it
    const genre = await Genre.findByIdAndDelete(req.params.id);

    // if the genre does not exit then
    if (!genre) {
        return res.status(404).send('Genre with the given ID does not exist');
    }

    res.send(genre); // response
});

module.exports = router;