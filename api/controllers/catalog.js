/**
 * CATALOG CONTROLLER
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

function publicGetAds(category, callback) {

	// lean format
	Ad.find({
		category: category
	}).lean().exec(callback);

}

module.exports = {
	getAds: publicGetAds
};