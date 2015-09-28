/**
 * USER MODEL
 */

'use strict';

/**
 * START MODEL
 */

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
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
		required: true,
		// user
		default: 1
	},
	status: {
		type: Number,
		required: true,
		default: 0
	},
	meta: {
		avatar: String,
		user: {
			name: String,
			city: String
		},
		// private person
		pp: {
			firstname: String,
			middlename: String,
			lastname: String,
			city: String,
			// passport data
			series: String,
			number: String,
			issue: String,
			by: String
		},
		mfi: {
			name: String,
			legalname: String,
			bin: String,
			inn: String,
			legaladdress: String,
			actualaddress: String
		},
		ps: {
			name: String,
			legalname: String,
			bin: String,
			inn: String,
			license: String,
			legaladdress: String,
			actualaddress: String
		}
	},
	balance: {
		type: Number,
		required: true,
		default: 0
	},
	contacts: {
		name: String,
		phone: String,
		email: String
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

userSchema.options.toJSON = {
	transform: function (doc, user, options) {

		user.id = user._id;
		delete user._id;
		delete user.__v;
		delete user.password;
		delete user.created;
		delete user.updated;
		return user;

	}
};

var User = mongoose.model('User', userSchema);

module.exports = User;