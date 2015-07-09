<!-- 'use strict';
/**
 * Module dependencies
 */
var should = require('should'),
   userService = require('../services/user-service'),
   mongoose = require('mongoose'),
   User = mongoose.model('User');

/**
 * The objective of this test class is to test whether or not
 * an email get's sent to and know what todo when the email doesn't
 * get sent. This class will be used in other classes as a service.
 */
var user1;

describe('User-Service Unit Test: ', function() {

   before(function(done) {

      user1 = new User({
         firstName: 'Mark',
         lastName: 'Down',
         displayName: 'Mark Down',
         email: 'test@test.com',
         username: '1234567890',
         password: 'password',
         provider: 'local',
         stripeCustomerToken: 'cus_6KW9JPW77VzgP4'
      });// end user

      user1.save(function(){
         done();
      });
   });// end before block

   describe('Method locateEmailByUser: ', function(){

      it('Should be able to return an email if a user id is provided.', function(){
         return userService.locateEmailByUser(user1.id, function(err) {
            console.log(err);
            should.equal('test@test.com');
         });
      });
      it('Should throw an error if the user does not exist.', function(){
         return userService.locateEmailByUser('2sd4fw', function(err) {
            should.exist(err);
         });
      });

   });

   after(function(done){
      User.remove().exec();
      done();
   });
}); //End Main Describe Block
 -->
