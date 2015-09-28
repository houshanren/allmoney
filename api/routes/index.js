/**
 * ROUTES
 */

'use strict';

/**
 * DEPENDENCIES
 */

var errorHandler = require(__home + 'error'),
	out = require('winston');

var express = require('express');
var router = express.Router();

/**
 * START ROUTE
 */

out.info('Listening on routes...');

module.exports = router;

