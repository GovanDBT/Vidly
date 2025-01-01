// module
const config = require('config');

module.exports = function() {
    // environment variable
    if (!config.get('jwtPrivateKey')) {
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined'); // error messages
    }
}