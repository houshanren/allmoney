/**
 * TOKEN CONTROLLER
 */

'use strict';

/**
 * DEPENDENCIES
 */

var config = require(__home + 'config'),
	out = require('winston');

/**
 * START CONTROLLER
 */

var _ = require('lodash');

// include models
var Token = require('../models/token');

function publicCheck(token, callback) {

	Token.findOne({
		token: token
	}, callback);

}

function publicCreate(data, callback) {

	var token = Token(data);
	// save the user
	token.save(callback);

}

module.exports = {
	create: publicCreate,
	check: publicCheck
};