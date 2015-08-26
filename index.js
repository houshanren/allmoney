/**
 * SERVER
 */

var express = require('express'),
	http = require('http'),
	path = require('path'),
	winston = require('winston'),
	morgan = require('morgan'),
	node;

// server-side
node = {
	port: process.env.PORT || 3000,

	// TODO: client-side files path
	staticPath: path.join(__dirname, 'static/build'),

}

var app = express();
var server = require('http').Server(app);

// port listen
server.listen(node.port, function () {

	out.info('Express server listening on port ' + node.port + '.');

	// TODO: routes server 
	require('./routes')(node, out);

});

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

app.set('port', node.port);
app.use(morgan('combined', {
	'stream': out.stream
}));
app.use(express.static(node.staticPath));

// index page
app.use('/', function (req, res) {

	res.sendFile(path.join(node.staticPath, 'index.html'));

});