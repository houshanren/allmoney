/**
 * TOKEN MODELS
 */

'use strict';

/**
 * START MODEL
 */

// default
var TOKEN_TIME = 86400;

var mongoose = require('mongoose');

var tokenSchema = new mongoose.Schema({
	token: {
		type: String
	},
	expired: {
		type: Date,
		default: Date.now() + TOKEN_TIME * 1000
	}
});

tokenSchema.methods = {

	hasExpired: function () {

		return expired < Date.now();

	}

};

var Token = mongoose.model('Token', tokenSchema);

module.exports = Token;