'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var giftcards = require('../../app/controllers/giftcards.server.controller');


	// app.route('/spendAGiftcard')
	// .post(giftcards.spendAGiftcard);
	// Giftcards Routes

	app.route('/giftcards')
		.get(users.requiresLogin, giftcards.list)//
		.post(users.requiresLogin, giftcards.create);
	app.route('/giftcards/:giftcardId')
		.get(users.requiresLogin, giftcards.hasAuthorization, giftcards.read)
		.delete(users.requiresLogin, giftcards.hasAuthorization, giftcards.delete);
	app.route('giftcards/:giftcardId/:amount')
		.put(users.requiresLogin, giftcards.hasAuthorization, giftcards.spendAGiftcard);
		//.post(users.requireLogin, giftcards.hasAuthorization, giftcards.send);// to send a giftcard we need two things.
		// a username(later a phone number) and a giftcard to send.
   	// Finish by binding the Giftcard middleware
	app.param('giftcardId', giftcards.giftcardByID);
	//app.param('giftcardUserName', giftcards.giftcardByUserName);
};
