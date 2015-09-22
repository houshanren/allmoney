/**
 * MAILER CONTROLLER
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

var nodemailer = require('nodemailer'),
	fs = require("fs"),
	_ = require('lodash');

// TEMP: test gmail account
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: config.fromEmail,
		// password for sender
		pass: 'dtxtckfd'
	}
});

function privateGetHtml(template, data) {

	var templatePath = config.partialsPath + template + '.html',
		templateContent = fs.readFileSync(templatePath, 'utf8');

	return _.template(templateContent, {
		interpolate: /{{([\s\S]+?)}}/g
	})(data);

}

function publicSendMail(options, callback) {

	var html = null;

	if (options.template) {
		html = privateGetHtml(options.template, options.data);
	}

	transporter.sendMail({
		from: config.fromEmail,
		to: options.to,
		subject: options.subject,
		text: options.text,
		html: html
	}, callback);

}

module.exports = {
	send: publicSendMail
};