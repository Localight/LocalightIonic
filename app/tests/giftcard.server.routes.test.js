// <!-- 'use strict';
//
// var should = require('should'),
//    request = require('supertest'),
//    app = require('../../server'),
//    mongoose = require('mongoose'),
//    User = mongoose.model('User'),
//    Giftcard = mongoose.model('Giftcard'),
//    agent = request.agent(app); // this is allows us to persist and save cookies
// // agent is basically creating a simulation of a our app.
//
// /**
//  * Globals
//  */
// var credentials, credentials2, user1, user2, giftcard;
//
// /**
//  * Giftcard routes tests
//  * What does  a giftcard do?
//  * Giftcards are purcahased and spent.
//  * A giftcard can never be owned by the user1 who created it.
//  * A giftcard must be sent to another user1. If one exists, then attach, else create that user1.
//  * To keep things modular, the giftcard does not handle the creation of the user1, it merely checks the databse
//  * for the one it is looking for. Idealy, the user1 portion of this should be contained in the user1 controller.
//  * I want to keep things modular.
//  */
// describe('Giftcard CRUD tests', function() {
//    // Setup Global Variables
//    beforeEach(function(done) {
//       // Create some user1 credintials
//       credentials = {
//          username: '2342345321', // we dont need them to be phone numbers in this instance
//          password: 'password'
//       };
//       credentials2 = {
//          username: '3453453453', // we dont need them to be phone numbers in this instance
//          password: 'password2'
//       };
//       // Create a new User
//       /**
//        * This will simulate the user1 who is sending the giftcard to another user1.
//        * @type {User}
//        */
//
//       user1 = new User({
//          firstName: 'Billy',
//          lastName: 'Bob',
//          // displayName: 'Billy Bob',
//          email: 'test@test.com', // need to find an actual email that I can simulate.
//          username: credentials.username,
//          password: credentials.password,
//          provider: 'local',
//          stripeCustomerToken: 'cus_6F4IWktgFqPHj3',
//          stripeCardToken: {
//             primary: 'card_162aBuBNPqu3SRN2d2hCYAKD'
//          },
//       });
//       /**
//        * This user1 will simulate the user1 who uses the giftcard.
//        * @type {User}
//        */
//       user2 = new User({
//          firstName: 'Nathan',
//          lastName: 'Drake',
//          displayName: 'Nathan Drake',
//          email: 'test@test.com',
//          username: credentials2.username,
//          password: credentials2.password,
//          provider: 'local',
//          stripeCustomerToken: 'cus_6F4IWktgFqPHj3',
//          stripeCardToken: {
//             primary: 'card_162aBuBNPqu3SRN2d2hCYAKD'
//          },
//       });
//       user2.save();
//       user1.save(function() {
//          giftcard = new Giftcard({
//             amount: 2000,
//             spenderOfGiftCard: user2.id,
//             stripeOrderId: 'ch_sd84sdfu2d',
//          });
//          done();
//       });
//    });
//
//    // I need to test that a giftcard can't be saved under the same user1..
//    it('user1 should be able to successfully save the giftcard, given the parameters are correct', function(done) {
//       // need to post it under one user1 and view under another.
//       // it should not apear in the same users list.
//       // The first user1 should, after creating the giftcard have // no giftcards.
//       // 1. Create the giftcard under one user1 and then,
//       // 2. view the giftcard under a different user1.
//       agent.post('/auth/signin')
//          .send(credentials)
//          .expect(200)
//          .end(function(signinErr, signinRes) {
//             // Handle signin error
//             if (signinErr) {
//                console.log('You had an error Signing in: ' + signinErr);
//                console.log('You got a successfuly login:' + signinRes.body);
//                done(signinErr);
//             }
//             // Save a new giftcard
//             agent.post('/giftcards')
//                .send(giftcard)
//                .expect(200)
//                .end(function(giftcardSaveErr, giftcardSaveRes) {
//                   // Handle giftcard save error
//                   if (giftcardSaveErr) {
//                      console.log('You had an error saving the giftcard: ' + giftcardSaveErr);
//                      done(giftcardSaveErr);
//                   }
//                   // if(giftcardSaveRes){
//                   //    console.log('Response from saving giftcard: '+JSON.stringify(giftcardSaveRes.body));
//                   // }
//                   should.not.exist(giftcardSaveErr);
//                   // Get a list of giftcards
//                   done();
//                });
//          });
//    });
//
//    it('should not be able to save Giftcard instance if not logged in', function(done) {
//       agent.post('/giftcards')
//          .send(giftcard)
//          .expect(401)
//          .end(function(giftcardSaveErr, giftcardSaveRes) {
//             if (giftcardSaveErr) {
//                console.log('error from saving giftcard:' + giftcardSaveErr.body);
//             }
//             if (giftcardSaveRes) {
//                console.log('response from saving a giftcard: ' + JSON.stringify(giftcardSaveRes.body));
//             }
//             // Call the assertion callback
//             done(giftcardSaveErr);
//          });
//    });
//
//    it('should not be able to get a list of Giftcards if not signed in', function(done) {
//       // TODO: come back ands structure this.
//       // Create new Giftcard model instance
//       giftcard.user = user1.id;
//       var giftcardObj = new Giftcard(giftcard);
//       // Save the Giftcard
//       giftcardObj.save(function() {
//          request(app).get('/giftcards/')
//             .expect(401)
//             .end(function(giftcardResponseErr, giftcardResponse) {
//                (giftcardResponse.body.message).should.match('User is not logged in');
//                done(giftcardResponseErr);
//             });
//       });
//    });
//    //TODO: Come back to this and finish it out.
//    it('a user should be able to get a list of gift if they are logged in', function(done) {
//       agent.post('/auth/signin')
//          .send(credentials2)
//          .expect(200)
//          .end(function(signinErr, signinRes) {
//             if (signinErr) {
//                console.log('error when trying to sign in: ' + signinErr);
//                done(signinErr);
//             }
//             var userId = user2.id;
//
//             agent.get('/giftcards')
//                .end(function(giftcardsGetErr, giftcardsGetRes) {
//                   //console.log(giftcardsGetRes.body);
//                   if (giftcardsGetErr) {
//                      console.log('error trying to get giftcards: ' + giftcardsGetErr);
//                      done(giftcardsGetErr);
//                   }
//                   // console.log('Response from getting giftcards' + giftcardsGetRes.body);
//                   var giftcards = giftcardsGetRes.body;
//
//                   // Set Assertions
//                   (giftcards[0].spenderOfGiftCard).should.equal(userId);
//                   (giftcards[0].amount).should.equal(2000);
//                   done();
//                });
//          });
//    });
//
//    it('should allow a user to spend a giftcard if they are logged in', function(done) {
//       agent.post('/auth/signin')
//          .send(credentials)
//          .expect(200)
//          .end(function(signinErr, signinRes) {
//             // Handle signin error
//             if (signinErr) {
//                console.log('You had an error Signing in: ' + signinErr);
//                console.log('You got a successfuly login:' + signinRes.body);
//                done(signinErr);
//             }
//             // Save a new giftcard
//             agent.post('/giftcards')
//                .send(giftcard)
//                .expect(200)
//                .end(function(giftcardSaveErr, giftcardSaveRes) {
//                   // Handle giftcard save error
//                   if (giftcardSaveErr) {
//                      console.log('You had an error saving the giftcard: ' + giftcardSaveErr);
//                      done(giftcardSaveErr);
//                   }
//                   // if(giftcardSaveRes){
//                   //    console.log('Response from saving giftcard: '+JSON.stringify(giftcardSaveRes.body));
//                   // }
//                   should.not.exist(giftcardSaveErr);
//                   // Get a list of giftcards
//                });
//          });
//       agent.post('/auth/signin')
//          .send(credentials2)
//          .expect(200)
//          .end(function(signinErr, signinRes) {
//             if (signinErr) {
//                console.log('error when trying to sign in: ' + signinErr);
//                done(signinErr);
//             }
//             var payload = {
//                giftcard: giftcard,
//                valueToSpend: 500
//             };
//
//             agent.put('/giftcards/' + giftcard.id)
//                .send(payload)
//                .expect(200)
//                .end(function(giftcardSpendErr, giftcardSpendRes) {
//                   if (giftcardSpendErr) {
//                      console.log('Error form trying to spend a giftcard: ' + giftcardSpendErr);
//                      done(giftcardSpendErr);
//                   }
//                   (giftcardSpendRes.body.amount).should.equal(1500);
//                   done();
//                });
//          }); // end login
//    });
//
//    afterEach(function(done) {
//       User.remove().exec();
//       Giftcard.remove().exec();
//       done();
//    });
// });
//  -->
