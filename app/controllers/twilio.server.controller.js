'use strict';

/**
 *  Module dependencies.
 *
 */
var twilio = require('twilio'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Q = require('q'),
    _ = require('lodash');

exports.incomingGiftMessage = function(response, request){
  // this is a controller, but you do everything in a controller.
  // getting user from database.
  // doing to much in controller.
  // user.service, pass in phone number. return the object as promise or callback.
  //
  //
  var twiml = new twilio.TwimlResponse();
  twiml.message('💌📲 Send a gift to anyone in Greater Long Beach ▸ ' + 'localhost:3000/giftcards/create');
  response.type('text/xml');
  response.send(twiml.toString());

  // verifiy user once all informaion is put into first giftcard made. from then on when you log in existing user,
  // use their user id to get purchasing data.
  //
  User.findOne({
    'mobileNumber': request.body.From.slice(2,12)
  }, function(err, user) {
    // In case of any error return
    if (err) {
      console.log('Error in incomingGiftMessage method, within twilio.: ' + err);
      return (err);
    }
    // already exists
    if (user) {
      console.log('here is the user as he already exists: ' + user);
      return response.json(user);
    } else {
      // if user is not found create here.
      console.log('contents of response' + JSON.stringify(request.body));
      // if there is no user with that phoneNumber
      // create the user, with the data entered on the giftcard
      var anotherUser = new User();
      console.log('contents of the otherUser as it is created: ' + anotherUser);
      // set the user's local credentials
      anotherUser.firstName = '';
      // anotherUser.password = request(password);//TODO: come back to this.
      anotherUser.password = 'password'; //TODO: figure out how to handle new user signup later.
      anotherUser.mobileNumber = request.body.From.slice(2,12);
      anotherUser.provider = 'local';
    //  anotherUser.email = request.body.email;

      var payload = {
        description: request.fullName
      };
      // passport
      //
      stripe.customers.create(payload).then(function handler(response) {
        // get and save the new users's token.
        console.log('reponse from stripe' + JSON.stringify(response));
        anotherUser.stripeCustomerTokenThing = response.id;
        console.log('contents of anotherUser' + anotherUser);
        return anotherUser.save(); // saves user here.
      }).then(function anotherHandler(response){
        return response.json(anotherUser);
      }).catch(function errHandler(err) {
        console.log('this is the error from signing up at the end ' + err);
        return response.status(400).send(err);
      });
      // tokenize user as well.
      //TODO: need to figure out how and when to do that for user.
      // in theory could add it to the sign in, then if they have a token already it doesn't fire.
      // anotherUser.email = request.param('email');
      // newUser.firstName = request.param('firstName');
      // newUser.lastName = request.param('lastName');
      // save the user
    }
  });
};
