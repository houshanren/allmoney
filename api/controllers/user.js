/**
 * USER CONTROLLER
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
var User = require('../models/user');

// include controllers
var Code = require('../controllers/code'),
	Token = require('../controllers/token'),
	Mailer = require('../controllers/mailer');

function publicSignin(data, callback) {

	if (!data.password || !data.email)
		return callback(new Error('Authentication failed. Invalid user or password'));

	data.password = Code.hash(data.password);

	User.findOne({
		email: data.email,
		password: data.password
	}, callback);

}

function publicCreate(data, callback) {

	if (!data.username) {
		data.username = data.email;
	}

	data.password = Code.hash(data.password);

	// TEMP: create new user
	var user = User(data);

	// save the user
	user.save(callback);

}

function publicSendConfirmationEmail(user, secret, callback) {

	// generate token
	var tokenConfirmation = Code.encrypt(user.email, secret);

	Token.create({
		token: tokenConfirmation,
		// one week
		expired: Date.now() + 518400 * 1000
	}, function (err, data) {

		if (err)
			return callback(err);

		Mailer.send({
			to: user.email,
			subject: 'Подтвердите адрес эл. почты',
			template: 'mails/register',
			data: {
				domain: config.domain,
				username: user.username,
				// TEMP
				token: tokenConfirmation
			}
		}, callback);

	});

}

function publicCheckConfirmationEmail(token, secret, callback) {

	Token.check(token, function (err, data) {

		if (err)
			return callback(err);
		if (!data)
			return callback(new Error('Token not found'));

		var email = Code.decrypt(data.token, secret);
		publicGetByEmail(email, function (err, user) {

			if (err)
				return callback(err);
			if (user.status !== 0)
				return callback(new Error('Account already activated'));

			// activate account
			user.status = 1;

			user.save(callback);

		});

	});

}

function publicGetById(id, callback) {

	User.findById(id, callback);

}

function publicGetByEmail(email, callback) {

	User.findOne({
		email: email
	}, callback);

}

module.exports = {
	signin: publicSignin,
	create: publicCreate,
	sendConfirmationEmail: publicSendConfirmationEmail,
	checkConfirmationEmail: publicCheckConfirmationEmail,
	getById: publicGetById,
	getByEmail: publicGetByEmail
};