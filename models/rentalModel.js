// Modules
const mongoose = require('mongoose');
const Joi = require('joi');

// Schema
const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: { type: String, required: true, minlenght: 2, maxlength: 50 },
            phone: { type: String, required: true, minlenght: 4, maxlength: 20 },
            isGold: { type: Boolean, default: false }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: { type: String, required: true, trim: true, minlenght: 2, maxlength: 255 },
            dailyRentalRate: { type: Number, default: 0, min: 0, max: 255 }
        }),
        required: true
    },
    dateOut: { type: Date, required: true, default: Date.now },
    dateReturned: { type: Date },
    rentalFee: { type: Number, min: 0 }
});

// Static method
rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
};

// Instance method
rentalSchema.methods.return = function () {
    this.dateReturned = new Date(); // set dateReturned to current date

    const rentalDays = Math.ceil((this.dateReturned - this.dateOut) / (1000 * 60 * 60 * 24)); // Convert ms to days
    this.rentalFee = rentalDays * this.movie.dailyRentalRate; // Calculate the rental fee
}

// Model
const Rental = mongoose.model('Rentals', rentalSchema);

// Validation
function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    });

    return schema.validate(rental);
}

// exports
exports.Rental = Rental;
exports.validate = validateRental;