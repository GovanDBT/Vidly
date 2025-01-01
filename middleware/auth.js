// modules
const jwt = require('jsonwebtoken');
const config = require('config');

// middleware
module.exports = function (req, res, next) {
 const token = req.header('x-auth-token'); // name of our generated token
 if (!token) return res.status(401).send('Access denied. No token provided');
 
 try {
	 // jwt validates the token
	 // config reads the private key used to decode the token 
	 const decode = jwt.verify(token, config.get('jwtPrivateKey'));
	 req.user = decode;
	 next(); // pass control to the next middleware
	}
	catch (ex) {
		res.status(400).send('Invalid token!')
	}
}