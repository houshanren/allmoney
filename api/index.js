/**
 * SERVER
 */

'use strict';

global.__home = __dirname + '/';

var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	path = require('path'),
	morgan = require('morgan');


var config = require('./config'),
	errorHandler = require(__home + 'error'),
	out = require('./logger');

// stream
out.stream = {
	write: function (message, encoding) {

		out.info(message);

	}
};

var app = module.exports = express();
var db = mongoose.connect('mongodb://localhost/allmoney').connection;

// TODO: routes
var routes = require('./routes'),
	user = require('./routes/user'),
	ad = require('./routes/ad'),
	catalog = require('./routes/catalog');

app.set('port', config.port);
app.set('secret', config.secret);

// TODO: app define
app.use(morgan('combined', {
	'stream': out.stream
}));
// bodyparser
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
// url routes
app.use('/api', routes);
app.use('/api/user', user);
app.use('/api/ad', ad);
app.use('/api/catalog', catalog);
// static path
app.use(express.static(config.staticPath));

// TODO: otherwise route
app.get('/*', function (req, res) {

	res.sendFile(path.join(config.staticPath, 'index.html'));

});

// TODO: port listen
app.listen(config.port, function () {

	out.info('Express server listening on port ' + config.port + '.');
	// TODO: database connecting
	db.on('error', function () {

		out.error('Unable to connect to database.');

	});
	db.once('open', function () {

		out.info('Connected to database.');

	});

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {

	var err = new Error('Not Found');
	err.status = 404;
	next(err);

});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {

	return errorHandler(req, res, err.status || 500, 0, err.message);

});