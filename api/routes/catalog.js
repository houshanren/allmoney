/**
 * CATALOG ROUTES
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
var Catalog = require('../controllers/catalog');

// handler

router.get('/:category', getAds);

// functions

function getAds(req, res) {

	var category = config.adCategories[req.params.category];

	Catalog.getAds(category, function (err, ads) {

		if (err)
			return errorHandler(req, res, 404, 10, err.message);
		if (!ads)
			return errorHandler(req, res, 404, 10, 'Ads not found');

		res.json(ads);

	});

}

module.exports = router;