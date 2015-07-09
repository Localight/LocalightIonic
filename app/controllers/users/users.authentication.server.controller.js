'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
   errorHandler = require('../errors.server.controller'),
   mongoose = require('mongoose'),
   // twilio = require('twilio'),
   passport = require('passport'),
   Q = require('q'),
   User = mongoose.model('User'),
   config = require('../../../config/config'),
   message = null,
   client = require('twilio')(config.twilio.accountSID, config.twilio.authTOKEN),
   stripe = require('stripe')(config.stripe.secretKey),
   async = require('async'),
   crypto = require('crypto');

exports.signup = function(req, res) {
   // Stil need a way to sign up the user.
   //
   delete req.body.roles;

   // Init Variables
   var user = new User(req.body);
   var message = null;

   // Add missing user fields
   user.provider = 'local';
   user.fullName = user.firstName + ' ' + user.lastName;
   user.displayName = user.firstName + ' ' + user.lastName;

   stripe.customers.create({
      description: 'This is a customer who can purchase giftcards for localism.',
      email: user.email,
      metadata: {
         firstName: user.firstName,
         lastName: user.lastName,
         phoneNumber: user.username
      }
   }).then(function handler(response) {
      user.stripeCustomerToken = response.id; // store the stripe token.
      return user.save(function(err) {
         if (err) {
            return res.status(400).send({
               message: errorHandler.getErrorMessage(err)
            });
         } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;
            req.login(user, function(err) {
               if (err) {
                  console.log(err);
                  res.status(400).send(err);
               } else {
                  res.json(user);
               }
            });
         }
      });
   }).catch(function errHandler(err) {
      console.log(err);
      return res.status(400).send({
         message: errorHandler.getErrorMessage(err)
      });
   });
};
exports.twilioWebHookLogin = function(req, res) {

   console.log('in webhooklogin');
   User.findOne({
      textToken: req.params.token,
      textTokenExpires: {
         $gt: Date.now()
      }
   }, function(err, user) {
      user.password = undefined;
      user.salt = undefined;
      user.textToken = undefined;
      user.textTokenExpires = undefined;
      req.login(user, function(err) {
         if (err) {
            console.log(err);
            res.status(400).send(err);
         } else {

            // I need to figure how to log in the user and redirect them.
            //res.json(user);
            return res.json(user);
         }
      });
   });
};


//NOTE: The giftWebHook method might change over time. If we get different
// words texted to ther server we will have to handle them accordinlgy
// This also might be a switch statement.
//NOTE: Verison future, create a systemt to handle incorrect texts,
// and continual incorrect texts
exports.twilioWebHook = function(req, res) {
   /** Alright so the user hit's this point and now we have their phone number, as well as some other useless info.
   // more than that we know the user wants to log into their account or want's access to there account.
   // So what do we do?
   // I want to log them in.
   //
   // get the user id of the mobile number from the user.
   // send teh user back a astatic create giftcard site.
   // if the user is new the info is blank, if returning, info filled in.
   // no need to log the user in for buying a giftcard. make sure can't add own user name to giftcard too.
   // at some point make sure the url and or cookie seld denotates, so user's data is protected.
   // remember to just return a static page.
   // this is a controller, but you do everything in a controller.
   // getting user from database.
   // doing to much in controller.
   // user.service, pass in phone number. return the object as promise or callback.
 **/

   if (req.body.Body.toLowerCase().trim() === 'gift') {
      User.findOne({
         'username': req.body.From.slice(2, 12)
      }, function(err, user) {
         // In case of any error return
         if (err) {
            console.log('the error from database' + err);
            return (err);
         }
         // modified the user here.
         // create token and add to user.
         // already exists
         if (user) {
            console.log('Congrats you caught a user: ' + user);
            // Congrats you caught a user!
            async.waterfall([
               function(done) {
                  console.log('got in the crypto thing.');
                  crypto.randomBytes(6, function(err, buffer) {
                     var token = buffer.toString('hex');
                     done(err, token);
                  });
               },
               function(token, done) {
                  console.log('got in the user save part.');
                  user.textToken = token;
                  user.textTokenExpires = Date.now() + 3600000;
                  user.save(function(err) {
                     done(err, token, user);
                  });
               },
               function(token, user, done) {
                  console.log('sending off the message');
                  client.messages.create({
                     body: 'http://lbgift.com/#!/giftcards/create/' + token,
                     to: req.body.From,
                     from: '+15624454688'
                  }, function(err, message) {
                     done(err, message, user);
                  });
               }
            ], function(err) {
               if (err) {
                  console.log(err);
               }
            });
         } else {
            console.log('got here in twilio controller');
            // if user is not found create here.
            // if there is no user with that phoneNumber
            // create the user, with the data entered on the giftcard
            var anotherUser = new User();
            anotherUser.username = req.body.From.slice(2, 12);
            // set the user's local credentials
            //  anotherUser.firstName = req.body.firstName;
            // anotherUser.password = createHash(password);//TODO: come back to this.
            // TODO: implement sequence for creating new user with token.
            anotherUser.password = 'password'; //TODO: figure out how to handle new user signup later.
            //  anotherUser.mobileNumber = req.body.mobileNumber;
            anotherUser.provider = 'local';
            //  anotherUser.email = req.body.email;
            console.log('Congrats you caught a user: ' + anotherUser);
            // Congrats you caught a user!
            async.waterfall([
               function(done) {
                  console.log('got in the crypto thing.');
                  crypto.randomBytes(6, function(err, buffer) {
                     var token = buffer.toString('hex');
                     done(err, token);
                  });
               },
               function(token, done) {
                  console.log('got in the user save part.');
                  anotherUser.textToken = token;
                  anotherUser.textTokenExpires = Date.now() + 3600000;
                  stripe.customers.create().then(function handler(response){
                     anotherUser.stripeCustomerToken = response.id;
                     anotherUser.save(function(err) {
                        done(err, token, anotherUser);
                     });
                  }).catch(function errHandler(err) {
                     console.log(err);
                     return res.status(400).send(err);
                  });
               },
               function(token, anotherUser, done) {
                  console.log('sending off the message');
                  client.messages.create({
                     body: 'http://lbgift.com/auth/twilioWebHookLogin/' + token,
                     to: req.body.From,
                     from: '+15624454688'
                  }, function(err, message) {
                     done(err, message, anotherUser);
                  });
               }
            ], function(err) {
               if (err) {
                  console.log(err);
               }
            });
         }
      });
   } else {
      //NOTE: Need to work on how to handle errors more efficently in node.
      // need to make sure I handle the errors so that the server doesn't crash
      console.log('attempt made to server, Body was:' + req.body.Body);
   }
};

/**
 * FindOrCreateUser, if user isn't avaible create that user.
 */
exports.findOrCreateUser = function(req, res){
   //the body of the request should be a phone number.
   // If the phone numebr doesn't exist in the database create that user.
   // If the user does exist return the user id.
   //NOTE: I'm not sure what it's going to be like when they try to ping this sever, so I'
   // I'm guessing I should look to see what comes in to my server.
   // Maybe create a way to update any of the user's info.
   console.log(JSON.stringify(req.body));
   User.findOne({
      'username':req.body.mobileNumber
   }, function(err, user){
      if(err){
         console.log('there was an error trying to connect to the databasae: '+err);
      }
      if(user){
         console.log('We got back a user.'+user);
         console.log(JSON.stringify(user));
         return JSON.stringify(user._id);
      }else{
         console.log('the user did not exist, time to create them');
         // the user doesn't exist.
         var anotherUser = new User();
         console.log('our newly created user'+anotherUser);
         console.log('the body of our request'+JSON.stringify(req.body.mobileNumber));
         anotherUser.username = req.body.mobileNumber;
         // set the user's local credentials
       // anotherUser.firstName = req.body.firstName;
        anotherUser.password = 'password'; //TODO: figure out how to handle new
        anotherUser.provider = 'local';
         //  anotherUser.email = req.body.email;

         stripe.customers.create().then(function handler(response) {
            // get and save the new users's token.
            console.log('our respose from stripe'+JSON.stringify(response));
            anotherUser.stripeCustomerToken = response.id;
            console.log(JSON.stringify('finished user before save'+anotherUser));
            return anotherUser.save(function(err){
               if(err){
                  return res.status(400).send({
                     message:errorHandler.getErrorMessage(err)
                  });
               }else{
                  console.log(anotherUser);
                  return res.json(anotherUser._id);
               }
            });
         }).catch(function errHandler(err) {
       console.log(err);
            return res.status(400).send({
               message: errorHandler.getErrorMessage(err)
            });
         });
      }
   });
};
/**
 * Signin after passport authentication
 **/
exports.signin = function(req, res, next) {

   passport.authenticate('local', function(err, user, info) {
      if (err || !user) {
         res.status(400).send(info);
      } else {
         // Remove sensitive data before login
         user.password = undefined;
         user.salt = undefined;

         req.login(user, function(err) {
            if (err) {
               res.status(400).send(err);
            } else {
               res.json(user);
            }
         });
      }
   })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
   req.logout();
   res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
   return function(req, res, next) {
      passport.authenticate(strategy, function(err, user, redirectURL) {
         if (err || !user) {
            return res.redirect('/#!/signin');
         }
         req.login(user, function(err) {
            if (err) {
               return res.redirect('/#!/signin');
            }

            return res.redirect(redirectURL || '/');
         });
      })(req, res, next);
   };
};


/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
   if (!req.user) {
      // Define a search query fields
      var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
      var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

      // Define main provider search query
      var mainProviderSearchQuery = {};
      mainProviderSearchQuery.provider = providerUserProfile.provider;
      mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

      // Define additional provider search query
      var additionalProviderSearchQuery = {};
      additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

      // Define a search query to find existing user with current provider profile
      var searchQuery = {
         $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
      };

      User.findOne(searchQuery, function(err, user) {
         if (err) {
            return done(err);
         } else {
            if (!user) {
               var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

               User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                  user = new User({
                     firstName: providerUserProfile.firstName,
                     lastName: providerUserProfile.lastName,
                     username: availableUsername,
                     displayName: providerUserProfile.displayName,
                     email: providerUserProfile.email,
                     provider: providerUserProfile.provider,
                     providerData: providerUserProfile.providerData
                  });

                  // And save the user
                  user.save(function(err) {
                     return done(err, user);
                  });
               });
            } else {
               return done(err, user);
            }
         }
      });
   } else {
      // User is already logged in, join the provider data to the existing user
      var user = req.user;

      // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
      if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
         // Add the provider data to the additional provider data field
         if (!user.additionalProvidersData) user.additionalProvidersData = {};
         user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

         // Then tell mongoose that we've updated the additionalProvidersData field
         user.markModified('additionalProvidersData');

         // And save the user
         user.save(function(err) {
            return done(err, user, '/#!/settings/accounts');
         });
      } else {
         return done(new Error('User is already connected using this provider'), user);
      }
   }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
   var user = req.user;
   var provider = req.param('provider');

   if (user && provider) {
      // Delete the additional provider
      if (user.additionalProvidersData[provider]) {
         delete user.additionalProvidersData[provider];

         // Then tell mongoose that we've updated the additionalProvidersData field
         user.markModified('additionalProvidersData');
      }

      user.save(function(err) {
         if (err) {
            return res.status(400).send({
               message: errorHandler.getErrorMessage(err)
            });
         } else {
            req.login(user, function(err) {
               if (err) {
                  res.status(400).send(err);
               } else {
                  res.json(user);
               }
            });
         }
      });
   }
};
