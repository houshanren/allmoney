/**
 * AD CONTROLLER
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
var Ad = require('../models/ad');

// include controllers
var Code = require('../controllers/code'),
	Token = require('../controllers/token'),
	Mailer = require('../controllers/mailer');

function publicUpdate(ad, data, callback) {

	// ...

	ad.save(callback);

}

function publicCreate(data, callback) {

	// ...

	// TEMP: create new ad
	var ad = Ad(data);

	// save the ad
	ad.save(callback);

}

function publicGetById(id, callback) {

	Ad.findById(id, callback);

}

function publicGetByUser(userId, callback) {

	Ad.find({
		creator: userId
	}, callback);

}

module.exports = {
	update: publicUpdate,
	create: publicCreate,
	getById: publicGetById,
	getByUser: publicGetByUser
};