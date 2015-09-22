/**
 * CODE CONTROLLER
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

var crypto = require('crypto'),
	algorithm = 'aes-256-ctr';

function publicEncrypt(text, secret) {

	var cipher = crypto.createCipher(algorithm, secret);
	var crypted = cipher.update(text, 'utf8', 'hex');

	crypted += cipher.final('hex');
	return crypted;

}

function publicDecrypt(text, secret) {

	var decipher = crypto.createDecipher(algorithm, secret);
	var dec = decipher.update(text, 'hex', 'utf8');

	dec += decipher.final('utf8');
	return dec;

}

module.exports = {
	encrypt: publicEncrypt,
	decrypt: publicDecrypt
};