'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
   mongoose = require('mongoose'),
   User = mongoose.model('User'),
   Giftcard = mongoose.model('Giftcard');

/**
 * Globals
 */
var user, user2, giftcard;

/**
 * Unit tests
 * These tests enusre that the giftcard is saved properly, and if it has any methods that it excutes those corretly.
 *
 */
describe('Giftcard Model Unit Tests:', function() {
   // WHAT AM I TESTING?
   // I am testing the unit of the giftcard class object and all the things it could be doing.
   beforeEach(function(done) {
      // THE SETUP
      // 1. create a fake user to use that simulates an actualy user.
      // 2. create a fake giftcard for them to pass around,

      user = new User({
         // create what you need to make a bare minumn user.
         firstName: 'Sebastion',
         lastName: 'Ultron',
         displayName: 'Sebastion Ultron',
         email: 'test@tester.com', //TODO: use an actual email address for this user.
         username: '2132203433',
         password: 'password'
      });

      user2 = new User({
         // create what you need to make a bare minumn user.
         firstName: 'Tina',
         lastName: 'Fey',
         displayName: 'Tina Fey',
         email: 'greatwolf3d@gmail.com', //TODO: use an actual email address for this user.
         username: 'testUser2',
         password: 'password'
      });

      user.save(function(){
         giftcard = new Giftcard({
            stripeOrderId: 'ch_34sdfsdf',
            amount: 1000,
            toUser: user.id,
            fromUser: user2.id,
         });
         done();
      });
   });



   // describe('Pre-Save Method', function(){
   // });
   describe('Method Save', function() {
      // when it saves should be able to save with out probelems it means, that the obejct is created, with alll the requirments,
      // specified in the objects model schema. i.e, all the require functions are valid and the informaiton made it to the database.
      // this is the base case that everyhthing works.
      it('should be able to save without problems', function(done) {
         return giftcard.save(function(err) {
            should.not.exist(err);
            done();
         });
      });

      it('should throw an error when trying to save without a number', function(done) {
         giftcard.amount = null;
         return giftcard.save(function(err) {
            should.exist(err);
            done();
         });
      });
      it('should throw an error when trying to save a negative number', function(done) {
         giftcard.amount = -23432;
         return giftcard.save(function(err) {
            should.exist(err);
            done();
         });
      });
      it('should throw an error when trying to save above the max amount', function(done) {
         giftcard.amount = 20000000;
         return giftcard.save(function(err) {
            should.exist(err);
            done();
         });
      });

      it('should throw an error when trying to save anything other than a number.', function(done) {
         giftcard.amount = 'asdfsd';
         return giftcard.save(function(err) {
            should.exist(err);
            done();
         });
      });

      it('should throw an error when trying to save a without a fromUser', function(done) {
         giftcard.fromUser = '';
         return giftcard.save(function(err) {
            should.exist(err);
            done();
         });
      });

      it('should throw an error when trying to save without a toUser', function(done) {
         giftcard.toUser = '';
         return giftcard.save(function(err) {
            should.exist(err);
            done();
         });
      });

      it('should throw an error when trying to save without a stripeId', function(done) {
         giftcard.stripeOrderId = '';
         return giftcard.save(function(err) {
            should.exist(err);
            done();
         });
      });
      it('should throw an error when trying to save a stripeID incorrectly, no puncation characters, only numbers and characters, pattern testing: ch_34sdfsdf', function(done) {
         giftcard.stripeOrderId = 'ch_$asdfas';
         return giftcard.save(function(err) {
            should.exist(err);
            done();
         });
      });
      //TODO: create a method or way to make sure the toUser and fromUser,
      // are not the same value.
   });

   // describe('Post-Save Method', function(){
   //
   // });
   afterEach(function(done) {
      Giftcard.remove().exec();
      User.remove().exec();

      done();
   });
});
