/*
 Custom IP middleware, record the request IP and store it on the request object
 */
var utils = require(__dirname + '/../services/utils');

module.exports = function ( req, res, next ) {

	// Store the IP address
	if (!req.ip){
		var ip = utils.getClientIp(req);
		if (ip){
			req.ip = ip;
		}
	}

	next();

};