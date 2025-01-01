const helmet = require('helmet'); // helmet library
const compression = require('compression'); // compression library

// export function
module.exports = function(app) {
    app.use(helmet()); // get the headers from helmet
    app.use(compression()); // compress the response body
}