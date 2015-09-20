/**
 * USER ROUTES
 */

module.exports = (function (node, out, app, router) {

	var _ = require('lodash'),
		jwt = require('jsonwebtoken');

	// include models
	var User = require('../controllers/user')(node, out);

	/**
	 * handler
	 */

	router.get('/user/validate', validateToken);
	router.post('/user/register', createUser);
	router.post('/user/signin', signinUser);
	router.get('/user/:id', getUserById);

	/**
	 * functions
	 */

	function addAuthHeaders(res, userId, token, expires) {

		if (token) {
			res.set('access-token', token);
            res.set('token-type', 'Bearer');
            res.set('expiry', Math.ceil(Date.now() / 1000) + expires);
            res.set('uid', userId);
		}

	}

	function authenticate(req, res, next) {

		var token = req.get('access-token');

		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, app.get('secret'), function (err, decoded) {

				if (err) {
					return res.json({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					var expires = node.authExpires,
						userId = req.get('uid');

					// add headers
					addAuthHeaders(res, userId, token, expires);

					// TEMP: ... controller
					User.getById(userId, function (err, user) {

						if (err || !user) return res.status(404).send(err);

						res.json(user);

					});
				}
			});

		} else {

			// if there is no token
			// return an error
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});

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

			if (err) return res.status(404).send(err);

			if (!user) {
				res.status(404).json({
					success: false,
					message: 'Authentication failed. Invalid user or password.'
				});
			} else {
				var expires = node.authExpires, // expires in 24 hours
					token = jwt.sign(user, app.get('secret'), {
						expiresInMinutes: expires
					});

				// add headers
				addAuthHeaders(res, user._id, token, expires);

				res.json(user);
			}

		});

	}

	function createUser(req, res) {

		var data = req.body;

		User.create(data, function (err, user) {

			if (err) return res.send(err);

			out.info('Created new user - ' + user.username + '.');

			res.json(user);

		});

	}

	function getUserById(req, res, next) {

		User.getById(req.params.id, function (err, user) {

			if (err || !user) return res.status(404).send(err);

			res.json(user);

		});

	}

	function getUserByName(req, res) {

		User.getByName(req.params.username, function (err, user) {

			if (err || !user) return res.status(404).send(err);

			res.json(user);

		});

	}

});