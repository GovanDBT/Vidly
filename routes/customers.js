// Modules
const { Customer, validate } = require('../models/customerModel');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();

// HTTP Get request - retrieve all customers
router.get('/', [auth, admin], async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

// retrieves customer with a specific id
router.get('/:id', [auth, admin], async (req, res) => {
    // look for customer
    const customer = await Customer.findById(req.params.id);

    // if the customer does not exit then
    if (!customer) {
        return res.status(404).send('Customer with the given ID does not exist');
    }

    // response
    res.send(customer);
})

// HTTP Post request - create a new customer
router.post('/', auth, async (req, res) => {
    // validate input coming from the client
    const { error } = validate(req.body);

    // if validation error
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    // define a new genre
    const customer = new Customer({ 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    await customer.save(); // save genre to DB

    res.send(customer); // response
});

// HTTP Put request - updating customer
router.put('/:id', [auth, admin], async (req, res) => {
    // check if client input validation is correct
    const { error } = validate(req.body);

    // if input validation fails, then
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    // look for customer and update them
    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, { new: true });

    // if the customer does not exit then
    if (!customer) {
        return res.status(404).send('Customer with the given ID does not exist');
    }

    res.send(customer); // response
});

// HTTP Delete request - deleting a customer
router.delete('/:id', [auth, admin], async (req, res) => {
    // look for the customer and delete them
    const customer = await Customer.findByIdAndDelete(req.params.id);

    // if the genre does not exit then
    if (!customer) {
        return res.status(404).send('Customer with the given ID does not exist');
    }

    res.send(customer); // response
});

module.exports = router;