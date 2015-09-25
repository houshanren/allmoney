/**
 * AD MODEL
 */

'use strict';

/**
 * START MODEL
 */

var mongoose = require('mongoose');

var adSchema = new mongoose.Schema({
	// ...
});

adSchema.methods = {

	// ...

};

adSchema.pre('save', function (next) {

	// ...

	// TODO: update date
	var currentDate = new Date();

	this.updated = currentDate;

	if (!this.created) {
		this.created = currentDate;
	}

	next();

});

adSchema.options.toJSON = {
	transform: function (doc, ad, options) {

		ad.id = ad._id;
		delete ad._id;
		delete ad.__v;
		delete ad.created;
		delete ad.updated;
		return ad;

	}
};

var Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;