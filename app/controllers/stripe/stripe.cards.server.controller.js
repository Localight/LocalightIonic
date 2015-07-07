<!-- 'use strict';
var config = require('../../../config/config'),
   stripe = require('stripe')(config.clientID, config.clientSecret),
   errorHandler = require('../errors.server.controller'),
   _ = require('lodash'),
   Q = require('q'),
   message = null;

/**
 * Create a Card
 * Creates a new customer object.
 */
exports.createACard = function(req, res) {
   stripe.customers.createSource(req.user.customerToken,
      {
         source:req.body.cardToken,
      }
   ).then(function(response) {
      return response.id;
   }).catch(function errHandler(err) {
      return res.send(500, err);
   });

};

/**
 * Retrieve a Card
 * Returns a customer object if a valid identifier was provided. When requesting the ID of a customer that has been deleted, a  * * subset of the customer's information will be returned, including a "deleted" property, which will be true.
 */
exports.retreiveACard = function(req, res)
{
   //TODO: come back and make sure the cardtoken is the right
   // name for the property in the user model.
   stripe.customers.retrieveCard(req.user.customerToken, req.user.cardToken).then(function(response) {
      return response;
   }).catch(function errHandler(err) {
      return res.send(500, err);
   });
};

/*
 * Update Card
 */
exports.updateACard = function(req, res)
{
   if (req.body.email !== ' ' || '' || null)
   {
      var holderEmail = req.body.email
   }
   if (req.body.description !== '' || ' ' || null)
   {
      var holderDescription = req.body.description
   }
   //TODO: could come back later and add other fields.
   stripe.customers.update(req.user.customerToken,
      {
         email: holderEmail,
         description: holderDescription
         //TODO: list all the things you could update.
      }).then(function(response)
      {
         return response;
      }).catch(function errHandler(err)
      {
         return res.send(500, err);
      });
};
/*
 * Delete a Card
 */
exports.deleteACard = function(req, res)
{
   stripe.customers.deleteCard(req).then(function(response) {
      return response;
   }).catch(function errHandler(err) {
      return res.send(500, err);
   });
};

/*
 * List all Customers
 */
exports.listCardObjects = function(req, res) {
   stripe.customers.list(req.limit).then(function(response) {
      return response;
   }).catch(function errHandler(err) {
      return res.send(500, err);
   });
};
