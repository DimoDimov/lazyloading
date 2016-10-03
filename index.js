"use strict";

const moment = require('moment');
const _ = require('lodash');

// Load config variables into process.env namespace
require('node-env-file')('./config.env');

const Utils = require('./services/utils');

// Global logger
global.logOutput = function () {
	Array.prototype.unshift.call(arguments, '[' + moment().format() + '] ');
	console.log.apply(this, arguments);
};

// Start express router
const express = require('express');
const app = express();
const router = express.Router();
const http = require('http');
const server = http.createServer(app);

// Configure the server and request parsing
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
app.use(useragent.express());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Grab the IP address of each request and store it on the request object
app.use(require('./middleware/ip'));

// Log each request
app.use(require('./middleware/request-logger'));

// Front-end setup
const exphbs = require('express-handlebars');
app.hbs = exphbs.create({
	defaultLayout: 'main',
	helpers      : {
		json: ( context ) => JSON.stringify(context),
		rawHelper: ( options ) => options.fn() // Allows angular to use {{ }}
	}
});
app.use(express.static('./public'));
app.set('views', './views');
app.engine('handlebars', app.hbs.engine);
app.set('view engine', 'handlebars');

// Init single-page route
app.use((req, res) => {
	"use strict";

	return res.status(200).render('pages/performance-test', {
		page_name            : 'WSD Technical Test',
		page_title           : 'UI Performance',
		lang                 : 'en'
	});

});

// Handle all uncaught errors
app.use( ( err, req, res, next ) => {

	// If headers are already sent, default to nodes default handler
	if ( res.headersSent ) {
		return next(err);
	}

	// Otherwise send a server exception
	res.status(500).send(err.message || err);

});

// Start server
server.listen(process.env.port, process.env.host, () => {
	logOutput(process.env.app_name + ' Running on ' + process.env.host + ':' + process.env.port);
});

// Export server
module.exports = server;
