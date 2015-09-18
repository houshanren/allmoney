/**
 * USER ROUTES
 */

module.exports = (function (node, out, router) {

	var _ = require('lodash');

	// include models
	var User = require('../models/user')(node, out);

	/**
	 * handler
	 */
	
	router.get('/user/:id', getUserById);
	router.post('/user/register', createUser);

	/**
	 * functions
	 */

	function getUserById(req, res) {

		User.findById(req.params.id, function (err, user) {

			if (err || !user) return res.status(404).send(err);

			res.json(user);

		});

	}

	function getUserByName(req, res) {

		User.findOne({
			username: req.params.username
		}, function (err, user) {

			if (err || !user) return res.status(404).send(err);

			res.json(user);

		});

	}

	function createUser(req, res) {

		// TEMP: create new user
		var user = User(req.body);

		// save the user
		user.save(function (err) {

			if (err) throw err;
			out.info('Created new user.');

		});

	}

});