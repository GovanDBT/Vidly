// Modules
const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genreModel');

// Schema
const moviesSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, minlenght: 2, maxlength: 255 },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, default: 0, min: 0, max: 255 },
    dailyRentalRate: { type: Number, default: 0, min: 0, max: 255 }
})

// Model
const Movie = mongoose.model('Movies', moviesSchema);

// input validation
function validateMovies(movie) {
    // define schema
    const schema = Joi.object({
        title: Joi.string().min(2).max(50).required(),
        genreId: Joi.objectId().required(), // we're getting the genre ID from the client
        numberInStock: Joi.number().min(0),
        dailyRentalRate: Joi.number().min(0)
    });

    // validate schema
    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovies;