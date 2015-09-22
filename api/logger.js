/**
 * LOGGER
 */

'use strict';

var winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
	timestamp: true,
	level: 'debug',
	colorize: true
});
winston.add(winston.transports.File, {
	filename: 'node.log'
});

module.exports = winston;