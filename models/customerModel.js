// Modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Schema
const customerSchema = new mongoose.Schema({
    isGold: { type: Boolean, default: false },
    name: { type: String, required: true, minlenght: 2, maxlength: 50 },
    phone: { type: String, required: true, minlenght: 4, maxlength: 20 }
})

// Model
const Customer = mongoose.model('Customer', customerSchema);

// input validation
function validateCustomer(customer) {
    // define schema
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        phone: Joi.string().min(5).max(20).required(),
        isGold: Joi.boolean()
    });

    // validate schema
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;