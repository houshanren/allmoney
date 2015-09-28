/**
 * AD MODEL
 */

'use strict';

/**
 * START MODEL
 */

var mongoose = require('mongoose');

var adSchema = new mongoose.Schema({
	term: {
		from: {
			type: Number,
			required: true
		},
		to: {
			type: Number,
			required: true
		},
		unit: {
			type: Number,
			required: true,
			// default days [0]
			default: 0
		}
	},
	rate: {
		from: {
			type: Number,
			required: true
		},
		to: {
			type: Number,
			required: true
		},
		unit: {
			type: Number,
			required: true,
			// default days [0, 1, 2]
			default: 0
		}
	},
	amount: {
		from: {
			type: Number,
			required: true
		},
		to: {
			type: Number,
			required: true
		}
	},
	period: {
		from: {
			type: Number,
			required: true
		},
		unit: {
			type: Number,
			required: true,
			// default minutes [0, 1, 2]
			default: 0
		}
	},
	// pp
	security: {
		type: [Number],
		default: [0, 1]
	},
	// mfi
	wayget: {
		type: [Number],
		default: [0, 1]
	},
	cities: {
		type: [Number],
		required: true,
		// default all cities
		default: [0]
	},
	link: {
		type: String,
		required: true
	},
	post: {
		type: String
	},
	// common data
	status: {
		type: Number,
		required: true,
		default: 0
	},
	category: {
		type: Number,
		required: true
	},
	creator: {
		type: mongoose.Schema.ObjectId,
		required: true
	},
	created: Date,
	updated: Date
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