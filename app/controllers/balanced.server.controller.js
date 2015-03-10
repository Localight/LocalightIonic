'use strict';
/**
 * Module dependencies
 */
var balanced = require('balanced-official'),
    errorHandler = require('./errors.server.controller'),
    Q = require('q');
    balanced.configure('ak-test-243p045kOCxSDITqcndq40XGNK60zQ7Ft');
/**
* Tokenize the user into a customer
*/
exports.tokenize_user_into_customer = function(req, res){
  // if(req.body.roles == 'merchant'){
  //
  // }else if(req.body.roles == 'patron'){
  //
  // }else{
  //
  // }
  console.log(JSON.stringify(req));
  var payload = {
    ein: req.body.ein,
    email: req.body.email,
    name: req.body.firstName+' '+req.body.lastName,
    business_name: req.body.businessName,
    phone: req.body.phoneNumber,
    address:{
      city: req.body.address.city,
      line1: req.body.address.line1,
      line2: req.body.address.line2,
      state: req.body.address.state,
      postal_code: req.body.address.postal_code
    }
  };
  // I wonder if I need to clear the data after I get it?
  balanced.marketplace.customers.create(payload).then(function handler(response){
    console.log('This response came from the balanced controller'+ JSON.stringify(response));
    return res.response.href;
  }).catch(function errHandler(err){
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};
/**
* Tokenize the bank account
*/
exports.tokenize_bank_account = function(req, res){
  var payload = {
    name: req.body.firstName +' '+req.body.lastName,
    account_type: 'checking',
    account_number: req.body.accountNumber,
    routing_number: req.body.routingNumber,
  };
  balanced.marketplace.bank_accounts.create(payload).then(function handler(response){
    console.log('the response from creating a bank account in the balanced controller' + JSON.stringify(response));
    return res.response.href;
  }).catch(function handler(err){
    console.log('this error came from creating a bank_account:'+ err);
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
      });
  });
};
/**
* associate bank account to customer
*/
exports.associate_bank_account_to_customer = function(req, res){
  balanced.get(req.body.balancedStuff.bank_account_token).associate_to_customer(req.body.balancedStuff.customer_token).then(function (){
    return balanced.get(req.body.balancedStuff.bank_account_token).verify();
  }).then(function handler(response){
    console.log('the response from assoicating a bank account to a customer' + JSON.stringify(response));
    return response.href;
  }).catch(function errHandler(err){
    console.log('this error came from assoicateing an account to a customer:'+ err);
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
      });
  });
};
/**
* confirm delete customer
*/
exports.delete_customer = function(req, res){
  // maybe want some kind of notification that the customer was deleted?
  balanced.get(req.body.balancedStuff.customer_token).unstore();
};
/**
* confirm update customer
*/
exports.update_customer = function(req, res){
  // balanced.get('/customers/CUoavBZFo6Zy8ohxex8HjZH')
  //     .set('name', 'alan turing')
  //     .set('email', '123@example.com')
  //     .save()
  // should be in the form, 'name', 'alan turing'
  balanced.get(req.body.balancedStuff.customer_token).set(req.body.payload).save();
};
/**
* confirm Bank Account
*/
exports.confrimt_bank_account = function(req, res){
  // have to come back to this one.
  balanced.get(req.body.balancedStuff.verification_token).confirm(req.body.value1, req.body.value2);
};


// add other functions later.