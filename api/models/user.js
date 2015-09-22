/**
 * USER MODELS
 */

'use strict';

/**
 * START MODEL
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name: String,
	username: {
		type: String,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: Number,
		// user
		default: 1
	},
	status: {
		type: Number,
		default: 0
	},
	meta: {
		logo: String
	},
	balance: {
		type: Number,
		default: 0
	},
	created: Date,
	updated: Date
});

userSchema.methods = {

	// ...

};

userSchema.pre('save', function (next) {

	// ...

	// TODO: update date
	var currentDate = new Date();

	this.updated = currentDate;

	if (!this.created) {
		this.created = currentDate;
	}

	next();

});

var User = mongoose.model('User', userSchema);

module.exports = User;