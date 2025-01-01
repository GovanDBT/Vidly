// modules
const Joi = require('joi');

module.exports =  function() {
    Joi.objectId = require('joi-objectid')(Joi); // add object id to joi validator
}