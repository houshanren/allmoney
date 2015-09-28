/**
 * CODE CONTROLLER
 */

'use strict';

/**
 * DEPENDENCIES
 */

var out = require('winston');

/**
 * START CONTROLLER
 */

var errorHandler = function (req, res, status, code, message) {

	var _message = message || 'Unknown error',
		ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	out.error(_message + ' (' + ip + ')');
	return res.status(status || 500).send({
		success: false,
		message: _message,
		code: code || 0
	});

}

module.exports = errorHandler;