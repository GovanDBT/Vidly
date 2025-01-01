// Modules
const Joi = require('joi');
const mongoose = require('mongoose');

// Schema
const genreSchema = new mongoose.Schema({
    genre: { type: String, required: true, minlength: 5, maxlength: 50 }
})

// Model
const Genre = mongoose.model('Genre', genreSchema);

// input validation
function validateGenre(genre) {
    // define schema
    const schema = Joi.object({
        genre: Joi.string().min(5).max(50).required()
    });

    // validate schema
    return schema.validate(genre);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;