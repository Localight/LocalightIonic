 'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend stripe controller
 */
module.exports = _.extend(
	  require('./stripe/stripe.charges.server.controller'),
     require('./stripe/stripe.accounts.server.controller'),
     require('./stripe/stripe.cards.server.controller'),
     require('./stripe/stripe.customers.server.controller'),
     require('./stripe/stripe.refunds.server.controller'),
     require('./stripe/stripe.transfers.server.controller')
);
