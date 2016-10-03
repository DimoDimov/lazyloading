/*
 Custom logging middleware, log each record
 */

module.exports = function ( req, res, next ) {

	logOutput('[REQUEST: ' + req.ip + '] [' + req.method + '] ' + req.originalUrl);

	next();

};