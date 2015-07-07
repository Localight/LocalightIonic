'use strict';
var config = require('../../../config/config'),
stripe = require('stripe')(config.clientID, config.clientSecret),
 errorHandler = require('../errors.server.controller'),
_ = require('lodash'),
Q = require('q'),
message = null;

/**
 * Create a Account
 */

exports.createAStripeManagedAccount = function(req, res){
   //each rtripe controller needs a
   stripe.accounts.create({
      managed:true,
      country:'US',
      email: req.user.email,
      metadata:{
         phoneNumber:req.user.username,
      },
      description:'this was created for the LocalightWebService',
   }).then(function handler(response){
      return res.response.id;
   }).catch(function errorHandler(errResponse){
      console.log(errResponse);
      return res.status(400).send({
         message: errorHandler.getErrorMessage(errResponse)
      });
   });
};

/**
 * Retrieve a Account details
 */
// exports.retrieveAccountDetails = function(req, res){
//    ({
//
//    }).then(function handler(resopnse){
//
//    }).catch(function errorHandler(errResponse){
//       console.log(errResponse);
//       return res.status(400).send({
//          message: errorHandler.getErrorMessage(errResponse)
//       });
//    });s
// };
// /*
//  *  Update an Account
//  */
//
// exports.updateAccount = function(req, res){
//    ({
//
//    }).then(function handler(resopnse){
//
//    }).catch(function errorHandler(errResponse){
//       console.log(errResponse);
//       return res.status(400).send({
//          message: errorHandler.getErrorMessage(errResponse)
//       });
//    });
// };
//
// /*
//  * List all connected Accounts
//  */
// exports.listAllConnectedAccounts = function(req, res){
//    ({
//
//    }).then(function handler(resopnse){
//
//    }).catch(function errorHandler(errResponse){
//       console.log(errResponse);
//       return res.status(400).send({
//          message: errorHandler.getErrorMessage(errResponse)
//       });
//    });
// };
