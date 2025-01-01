// Modules
const { User, validate } = require('../models/userModel');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const _ = require('lodash');

// HTTP Get request - retrieve current users
router.get('/me', [auth, admin], async (req, res) => {
    const user = await User.findById(req.user._id).select('-password'); // exclude password from the response
    res.send(user);
});

// HTTP Post request - create a new user
router.post('/', async (req, res) => {
    const { error } = validate(req.body); // validate input coming from the client

    if(error) return res.status(400).send(error.details[0].message); // if validation error

    let findUser = await User.findOne({ email: req.body.email }); // check if email user doesn't already exist

    if(findUser) return res.status(400).send(`user with email ${req.body.email} already exists`); // if user exists, error

    // define a new user
    const user = new User( _.pick(req.body, ['name', 'email', 'password', 'confirm_password']));

    const salt = await bcrypt.genSalt(10); // generate a salt

    user.password = await bcrypt.hash(user.password, salt); // hash password

    await user.save(); // save new user in the DB

    const token = user.generateAuthToken(); // generate a token
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email'])); // response with a header from the token (and picked properties)
});

module.exports = router;
