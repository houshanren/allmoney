/**
 * CONFIG
 */

'use strict';

var path = require('path');

var config = {
	port: process.env.PORT || 3000,

	// TODO: client-side files path
	staticPath: path.join(__dirname, '../static/build'),
	partialsPath: path.join(__dirname, './partials/'),

	secret: 'firefly',
	// one day
	authExpires: 86400,
	// TODO: email for sender
	fromEmail: 'druzhbin@seolead.pro',
	domain: 'allmoney.dev'
}

module.exports = config;