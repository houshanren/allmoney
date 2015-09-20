/**
 * USER CONTROLLERS
 */

module.exports = (function (node, out) {

	var _ = require('lodash');

	// include models
	var User = require('../models/user')(node, out);

	function publicSignin(data, callback) {

		User.findOne({
			email: data.email,
			password: data.password
		}, callback);

	}

	function publicCreate(data, callback) {

		if (!data.username) {
			data.username = data.email;
		}

		// TEMP: create new user
		var user = User(data);

		// ... send confirmation email

		// save the user
		user.save(callback);

	}

	function publicGetById(id, callback) {

		User.findById(id, callback);

	}

	function publicGetByName(username, callback) {

		User.findOne({
			username: req.params.username
		}, callback);

	}

	return {
		signin: publicSignin,
		create: publicCreate,
		getById: publicGetById,
		getByName: publicGetByName
	};

});