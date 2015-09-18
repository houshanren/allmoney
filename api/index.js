/**
 * SERVER
 */

var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	path = require('path'),
	// logging
	winston = require('winston'),
	// stream
	morgan = require('morgan'),
	node;

// server-side
node = {
	port: process.env.PORT || 3000,

	// TODO: client-side files path
	staticPath: path.join(__dirname, '../static/build'),

}

// logging config (winston)
var out = new(winston.Logger)({
	transports: [
		new(winston.transports.Console)({
			colorize: true,
			timestamp: false
		}),
		new(winston.transports.File)({
			filename: 'node.log'
		})
	]
});
out.level = 'debug';
out.stream = {
	write: function (message, encoding) {

		out.info(message);

	}
};

var app = express();
var router = express.Router();
var db = mongoose.connect('mongodb://localhost/allmoney').connection;

app.set('port', node.port);
app.use(morgan('combined', {
	'stream': out.stream
}));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use('/api', router);
app.use(express.static(node.staticPath));

// port listen
app.listen(node.port, function () {

	out.info('Express server listening on port ' + node.port + '.');

	// TODO: database connecting
	db.on('error', function () {

		out.error('Unable to connect to database.');

	});
	db.once('open', function () {

		out.info('Connected to database.');
		require('./models')(node, out);

	});

	// TODO: routes server 
	require('./routes')(node, out, router);

	// TODO: otherwise route
	app.get('/*', function (req, res) {

		res.sendFile(path.join(node.staticPath, 'index.html'));

	});

});