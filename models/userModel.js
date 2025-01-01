// Modules
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');
const Joi = require('joi');

// Schema
const usersSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlenght: 3, maxlength: 80 },
    email: { type: String, unique: true, required: true, minlenght: 5, maxlength: 255 },
    password: { type: String, required: true, minlenght: 8},
    isAdmin: Boolean
})

// Method for generating a token
usersSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

// Model
const User = mongoose.model('Users', usersSchema);

// input validation
function validateUsers(user) {
    // define schema
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).required(),
        confirm_password: Joi.any().valid(Joi.ref('password')).required().messages({
            "any.only": "The two passwords do not match",
            "any.required": "Please re-enter the password",
        })
    });

    // validate schema
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUsers;