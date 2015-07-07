'use strict';

/**
 * Module dependencies.
 */
// BUILD THE MAILBOXES
module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users.server.controller');
	/**
	 * @api{get} /user Request User Object
	 * @apiName GetUser
	 * @apiGroup User
	 *
	 * @apiParam {UserId} Give me a Unique Valid User ID.
	 * @apiSuccessUser Success-Response:
	 *  HTTP/1.0 200 OK
	 *  @apiError UserNotFound The id of the User was not found.
	 *
	 * @apiErrorUser Error-Response:
	 * 	HTTP/1.0 404 Not found
	 * 	{
	 * 		"error": "UserNotFound"
	 * 	}
	 *
	 */
	app.route('/users/me').get(users.me);
	/**
	 * @api{put} /user Update User Object
	 * @apiName PutUser
	 * @apiGroup User
	 */
	app.route('/users').put(users.update);
	/**
	 * @api{delete} /user Delete User Object OAuthProvider
	 * @apiName DeleteUser
	 * @apiGroup User
	 */
	app.route('/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users password api
	/**
	 * @api{post /user Request User Object
	 * @apiName PostUser
	 * @apiGroup User
	 */
	app.route('/users/password').post(users.changePassword);
	/**
	 * @api{post} /user Request User Object
	 * @apiName PostUser
	 * @apiGroup User
	 */
	app.route('/auth/forgot').post(users.forgot);
	/**
	 * @api{get} /user Request User Object
	 * @apiName GetUser
	 * @apiGroup User
	 */
	app.route('/auth/reset/:token').get(users.validateResetToken);
	/**
	 * @api{post} /user Request User Object
	 * @apiName PostUser
	 * @apiGroup User
	 */
	app.route('/auth/reset/:token').post(users.reset);

	app.route('/auth/giftWebHook/').post(users.giftWebHook);
	
	app.route('/auth/webHookLogin/:username/:password').post(users.webHookLogin);
	// Setting up the users authentication api
	/**
	 * @api{post} /user Request User Object
	 * @apiName PostUser
	 * @apiGroup User
	 */
	//app.route('/auth/findOrCreateUser').post(users.findOrCreateUser);// might want to make sure only logged in users can do this later.
	// TODO: make sure only logged in users can do this.
	/**
	 * @api{post} /user Request User Object
	 * @apiName PostUser
	 * @apiGroup User
	 */
	app.route('/auth/signup').post(users.signup);// hum...
	/**
	 * @api{post} /user Request User Object
	 * @apiName PostUser
	 * @apiGroup User
	 */
	app.route('/auth/signin').post(users.signin);
	/**
	 * @api{get} /user Request User Object
	 * @apiName GetUser
	 * @apiGroup User
	 */
	app.route('/auth/signout').get(users.signout);
	//  app.route('/stripe/charge').post(users.createACharge);
	// Having stripe next to and embedded with the user class, allows us to use stripe where and when we
	// need it.
	// stripe accounts routes
	// TODO: Enter in routes for the stripe accounts API
	// stripe cards routes
	// TODO: Enter in routes for stripe cards API
	// stripe customers routes
	// TODO: Enter in Routes for Stripe Customers API
	// stripe transfer routes
	// TODO: Enter in Routes for Stripe Transfer API
	// stripe refund routes
	// TODO: Enter in Routes for Stripe Refunds API
	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
