/**
 * USER ROUTES
 */

'use strict';

/**
 * DEPENDENCIES
 */

var config = require(__home + 'config'),
	errorHandler = require(__home + 'error'),
	out = require('winston');

var app = require(__home + 'index');
var express = require('express');
var router = express.Router();

/**
 * START ROUTE
 */

var _ = require('lodash'),
	jwt = require('jsonwebtoken');

// include controllers
var User = require('../controllers/user');

// handler

router.get('/validate', validateToken);
router.post('/register', createUser);
router.post('/signin', signinUser);
router.delete('/signout', signoutUser);
router.get('/register/:token', confirmationEmailUser);
router.get('/:id', getUserById);

// functions

function addAuthHeaders(res, userId, token, expiry) {

	if (token) {
		res.set('access-token', token);
        res.set('token-type', 'Bearer');
        res.set('expiry', expiry);
        res.set('uid', userId);
	}

}

function authenticate(req, res, next) {

	var token = req.get('access-token');

	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, app.get('secret'), function (err, decoded) {

			if (err)
				return errorHandler(req, res, 401, 1, err.message);

			// add headers
			addAuthHeaders(res, decoded._id, token, decoded.exp);

			res.json(decoded);

		});

	} else {
		// if there is no token
		// return an error
		return errorHandler(req, res, 401, 2, 'No token provided');
	}

}

function validateToken(req, res, next) {

	authenticate(req, res, next);

}

function signinUser(req, res) {

	var data = req.body;

	User.signin({
		email: data.email,
		password: data.password
	}, function (err, user) {

		if (err)
			return errorHandler(req, res, 403, 4, err.message);
		if (!user)
			return errorHandler(req, res, 403, 4, 'Authentication failed. Invalid user or password');

		var expires = config.authExpires,
			expiry = Math.ceil(Date.now() / 1000) + expires;

		// create token
		var token = jwt.sign(user.toJSON(), app.get('secret'), {
			expiresInSeconds: expires
		});

		// add headers
		addAuthHeaders(res, user._id, token, expiry);

		res.json(user.toJSON());

	});

}

function createUser(req, res) {

	var data = req.body;
	// original password
	var password = data.password;

	User.create(data, function (err, user) {

		if (err)
			return errorHandler(req, res, 500, 5, err.message);

		out.info('Created new user - ' + user.email + '.');

		// signin
		User.signin({
			email: user.email,
			password: password
		}, function (err, user) {

			if (err)
				return errorHandler(req, res, 403, 4, err.message);
			if (!user)
				return errorHandler(req, res, 403, 4, 'Authentication failed. Invalid user or password');

			var expires = config.authExpires,
				expiry = Math.ceil(Date.now() / 1000) + expires;

			// create token
			var token = jwt.sign(user.toJSON(), app.get('secret'), {
				expiresInSeconds: expires
			});

			// add headers
			addAuthHeaders(res, user._id, token, expiry);

			res.json(user.toJSON());

		});

		// TODO: send confirmation to mail
		User.sendConfirmationEmail(user.toObject(), app.get('secret'), function (err, info) {

			if (err)
				return errorHandler(req, res, 500, 5, err.message);

		});

	});

}

function confirmationEmailUser(req, res) {

	var token = req.params.token;

	if (token) {
		User.checkConfirmationEmail(token, app.get('secret'), function (err, user) {

			if (err)
				return errorHandler(req, res, 400, 3, err.message);

			// ... check ident emails
				
			res.sendStatus(200);

		});
	} else {
		// if there is no token
		// return an error
		return errorHandler(req, res, 400, 3, 'No token provided');
	}

}

function signoutUser(req, res) {

	var token = req.get('access-token');

	if (token) {
		// TEMP: after delete token
		jwt.verify(token, app.get('secret'), function (err, decoded) {

			if (err)
				return errorHandler(req, res, 400, 1, 'Failed to authenticate token');

			res.sendStatus(200);

		});
	} else {
		// if there is no token
		// return an error
		return errorHandler(req, res, 400, 2, 'No token provided');
	}

}

function getUserById(req, res) {

	out.log('debug', req.params.id);

	User.getById(req.params.id, function (err, user) {

		if (err)
			return errorHandler(req, res, 404, 6, err.message);
		if (!user)
			return errorHandler(req, res, 404, 6, 'User not found');

		res.json(user.toJSON());

	});

}

function getUserByName(req, res) {

	User.getByName(req.params.username, function (err, user) {

		if (err)
			return errorHandler(req, res, 404, 6, err.message);
		if (!user)
			return errorHandler(req, res, 404, 6, 'User not found');

		res.json(user.toJSON());

	});

}

module.exports = router;