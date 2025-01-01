// Modules
const { User } = require('../models/userModel');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const _ = require('lodash');
const Joi = require('joi');

// HTTP Post request - create a new login user
router.post('/', async (req, res) => {
    const { error } = validate(req.body); // validate input coming from the client

    if(error) return res.status(400).send(error.details[0].message); // if validation error

    let user = await User.findOne({ email: req.body.email }); // check if email user exists

    if(!user) return res.status(400).send(`Invalid email or password`); // if user not, error

    const validPassword = await bcrypt.compare(req.body.password, user.password); // compares passwords

    if(!validPassword) return res.status(400).send('Invalid email or password'); // error of password invalid

    const token = user.generateAuthToken(); // create a web token ({ payload}, secrete key)
    res.send(token);
});

function validate(req) {
    // define schema
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(8).required()
    });

    // validate schema
    return schema.validate(req);
}

module.exports = router;
