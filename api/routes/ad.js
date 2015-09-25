/**
 * AD ROUTES
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

var _ = require('lodash');

// include controllers
var Ad = require('../controllers/ad'),
	User = require('../controllers/user');

// handler

router.post('/create', createAd);
router.put('/update', updateAd);
router.get('/:id', getAdById);

// functions

function updateAd(req, res) {

	// ...

}

function createAd(req, res) {

	var userId = req.get('uid');
	// ... mb auth
	// TEMP
	User.getById(userId, function (err, user) {

		if (err)
			return errorHandler(req, res, 404, 6, err.message);
		if (!user)
			return errorHandler(req, res, 404, 6, 'User not found');

		var data = req.body;
		data.creator = user._id;
		data.category = user.role;
		if (user.role === 4)
			data.link = '/user/' + user._id;

		// TODO: create ad
		Ad.create(data, function (err, ad) {

			if (err)
				return errorHandler(req, res, 500, 8, err.message);

			res.json(ad.toJSON());

		});

	});

}

function getAdById(req, res) {

	Ad.getById(req.params.id, function (err, ad) {

		if (err)
			return errorHandler(req, res, 404, 9, err.message);
		if (!ad)
			return errorHandler(req, res, 404, 9, 'Ad not found');

		User.getById(ad.creator, function (err, user) {

			if (err)
				return errorHandler(req, res, 404, 6, err.message);
			if (!user)
				return errorHandler(req, res, 404, 6, 'User not found');

			// json user
			var _user = user.toJSON();

			res.json(_.assign(ad.toJSON(), {
				creator: {
					id: _user.id,
					role: _user.role,
					contacts: _user.contacts
				} 
			}));

		});

	});

}

function getUserByUser(req, res) {

	Ad.getByUser(req.params.uid, function (err, ad) {

		if (err)
			return errorHandler(req, res, 404, 9, err.message);
		if (!ad)
			return errorHandler(req, res, 404, 9, 'Ad not found');

		res.json(ad.toJSON());

	});

}

module.exports = router;