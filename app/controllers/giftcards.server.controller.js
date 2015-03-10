'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Giftcard = mongoose.model('Giftcard'),
	balanced = require('balanced-official'),
	Q = require('q'),
	User = mongoose.model('User'),
	_ = require('lodash');
	balanced.configure('ak-test-243p045kOCxSDITqcndq40XGNK60zQ7Ft');
/**
 * Create a Giftcard
 */
// for sending the giftcard to another user, use update, but makde sure to accpet another parameter that
exports.create = function(req, res) {

		var giftcard = new Giftcard(req.body);
		// putting the charge in here temp
		// all we need is the object data that is the user we are sending it to.
		// we then get the giftcard object, and say this is who you are equal to.

		 giftcard.user = req.user;
		// giftcard.fromUser = req.user;// why we don't assign the user in the test.
		// giftcard.merchant = req.body.merchant;
		// giftcard.toUser = req.body.
		// part of the test was just give it any value and have it save it to the database.

		giftcard.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(giftcard);
			}
		});
	};


exports.send = function(req, res){
// I would like to have the search method put with the user, so it's modular.
	var giftcard = new Giftcard(req.body);
	// now that this works, I need to go through the tests and create method to update them with this logic.
	// I need to make it so a user can not create a giftcard for themselves. 
	console.log(giftcard);
	User.findOne({
			username: giftcard.toUserUserName
	}).populate('user').exec(function(err, user) {
		console.log('this is the value of the err'+err);
		console.log('this is the value of the user'+user);
		if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else{
			giftcard.user = user._id;
			giftcard.save(function(err){
				if(err){
					console.log(err);
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}else{
					res.jsonp(giftcard);
				}
			});
    }
	});
};
		// creating a temporary giftcard to test things.
	// var payload = {
	// 	expiration_month:08,
	// 	expiration_year:2018,
	// 	number:4111111111111111,
	// 	card_brand:'VISA',
	// 	card_type: 'Credit',
	// 	cvv:'123',
	// };

	// for now save the token to the giftcard
// 	balanced.marketplace.cards.creat(payload).then(function handler(response){
// 		giftcard.cardToken = response.href;
// 		return giftcard.save();
// 	}).then(function anotherHandler(response){
// 		res.jsonp(giftcard);
// 	}).catch(function errHandler(err){
// 		console.log('This error came from trying to create a customer' + err);
// 		return res.status(400).send({
// 			message: errorHandler.getErrorMessage(err)
// 			});
// 		});
// };

/**
 * Show the current Giftcard
 */
exports.read = function(req, res) {
	res.jsonp(req.giftcard);
};
// Don't write new code, use the update and find methods to change ownder ship of the giftcard.
// the update and find methods work find.
/**
 * Update a Giftcard
 */
exports.update = function(req, res) {
	var giftcard = req.giftcard;

	giftcard = _.extend(giftcard , req.body);

	giftcard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(giftcard);
		}
	});
};

/**
 * Delete an Giftcard
 */
exports.delete = function(req, res) {
	var giftcard = req.giftcard ;

	giftcard.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(giftcard);
		}
	});
};

/**
 * List of Giftcards
 */
exports.list = function(req, res) {
	// hopefully this will only list the giftcards assoicated with this user.
	Giftcard.find({
		username:req.user.username
		}).populate('user', 'displayName').exec(function(err, giftcards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(giftcards);
		}
	});
};


/**
 * Giftcard middleware
 */
exports.giftcardByID = function(req, res, next, id) {
	Giftcard.findById(id).populate('user', 'displayName').exec(function(err, giftcard) {
		if (err) return next(err);
		if (!giftcard) return next(new Error('Failed to load Giftcard ' + id));
		req.giftcard = giftcard;
		next();
	});
};
// exports.giftcardByUserName = function(req, res, next, username) {
// 	Giftcard.giftcardByUserName(username).populate('user').exec(function(err, user) {
// 		if (err) return next(err);
// 		if (!user) return next(new Error('Failed to load Giftcard ' + user ));
// 		req.giftcard = user._id;
// 		next();
// 	});
// };

/**
 * Giftcard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.giftcard.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
