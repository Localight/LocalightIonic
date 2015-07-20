'use strict'; // I want to change gift card to CliqueCard, will do that later though.
// What if the giftcards, held an array of the transactions? The giftcard it's self had more that i kept track of?
//
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
   // mailgunService = require('../services/mailgun-service'),
   // twilioService = require('../services/twilio-service'),
   nodemailer = require('nodemailer'),
   config = require('../../config/config'),
   client = require('twilio')(config.twilio.accountSID, config.twilio.authTOKEN),
   smtpTransport = nodemailer.createTransport(config.mailer.options),
   //  twilioService = require('../services/twilio/outgoingTwilioText.service'),
   User = require('./user.server.model'),
   Schema = mongoose.Schema;
/**
 * Giftcard Schema,
 * Included are the validations for the mongoose model.
 */
var GiftcardSchema = new Schema({

   spendersFirstName:{
      type:String,
      required:'please enter the name of your friend'
   },
   amount: {
      type: Number,
      min: 0,
      max: 50000,//equates to $500.00, 100 = $1.00, 50 = $.50
      // need to make the number validate a number not less than zero.
      required: 'Please enter an amount to purchase between 0 and 500000'
   }, // need to make sure it's always a number and never zero or a negative number.
   // for initial purchase.
   purchasersFirstName:{
      type: String,
      require:'Please enter your first name.'
   },
   /**
    *  Message, the message that the user wishes for another user to see.
    *  a message doesn't need to have a string attached to it.
    */
   ocassion: {
      type: String,
      default: 'A gift for you!'
   },
   dateToSend:{
      type: String, // add string
      default: 'we dont have dates yet',
   },
   spenderMobileNumber:{
      type:String,// make it match a phone number regex
      trim:true,
      match:[/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/, 'Please fill a valid ten-digit phone number'],
      required: 'Please fill in a mobile number for your friend',
   },

   purchaserEmailAddress:{
      trim: true,
      type:String,// Make it match email validate that it's a valid email.
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
   },

   //TODO: probably going to need to store the a refernce to the image the user is sending back.
   created: {
      type: Date,
      default: Date.now
   },
   spenderOfGiftCardId: {
      type: Schema.ObjectId,
      ref: 'User',
      required: 'Please, enter the user id to send this giftcard too.'
   },
   purchaserOfGiftCardId: {
      type: Schema.ObjectId,
      ref: 'User',
      required: 'Please, enter the user id who is sending the giftcard.'
   },
   // subledger transaction id's
   // This is the intial transaction id, but we will also contain a array of subledger transactions.
   // intitalSubledgerTransactionId:{
   //    type:String,
   //    required: 'Please provide the subledger transaction Id associated with the intial purchase of this giftcard.'
   // },
   // subledgerLogsIds: [{
   //    logId:{
   //       type:String,
   //       // TODO: create a regular expression for what the subledger id's look like.
   //    },
   //    dateCreated:{
   //       type: Date,
   //       default: Date.now
   //    },
   // }],

   districtCode: {
      type:String,
      default: 'dont know what to do with this yet',
   },

   // purchasersPhoneNumber:{
   //    type: String
   // }, // will represent the user buying the giftcard as there username.
   stripeOrderId: {
      type: String,
      match: [/ch_[\w\d._%+-]+/, 'This value entered for the stripeId does not match ({VALUE})'],
      //TODO: write regular expresion to match "ch_"[0-2](spaces) for the stripe id.
      required: 'Please provide the stripeOrderId in the correct format.'
   }, // I should only get one stripeOrderId once

});
/**
 * Hook a pre save method to verify that the spenderofgiftcard and purchaserofgiftcard are not the
 * same user. could elborate later, and do a deep search to make sure these two
 * people are completely different and un related if we wanted too
 */
GiftcardSchema.post('save', function() {

   this.fireOffRecipet(this.purchaserEmailAddress);

   // User.findById({
   //    _id: this.purchaserOfGiftCard
   // }).exec(function(err, user){
   //    if(err){
   //       return err;
   //    }
   //    if(!user){
   //       return (new Error('Failed to locate User '+user));
   //    }
   //
   // });
   this.sendTextToFriend(this.spenderMobileNumber);
   // User.findById({
   //    _id: this.spenderOfGiftCard
   // }).exec(function(err, user){
   //    if(err){
   //       return err;
   //    }
   //    if(!user){
   //       return (new Error('Failed to locate User '+user));
   //    }
   //
   // });
});

//TODO: need to create method that accepts email, and fire off reciept email.
GiftcardSchema.methods.fireOffRecipet = function(anEmail) {
   //TODO: implement fire off to email.
   //NOTE: need to create a html template for the email.
   var mailOptions = {
      to:anEmail,
      from: config.MAILE_FROM,
      subject: 'Your Recent Gift-Card Purchase!',
      text: '\n\n' + 'You Recently purchased a giftcard' + this.amount + 'something'+'not sure what the email should say in its entiriety'
   };
//NOTE: if we use a template and I have to load variables, I will have to get more informaiton from the user.
// this works on a basic level though.
   return smtpTransport.sendMail(mailOptions, function(error, info){
      if(error){
         console.log(error);
         //NOTE: note sure what to do about error handling in this area.
      }else{
         console.log('Email Reciept sent: '+info.response);
      }
   });
};
//TODO: need to create a method that accepts phoen number, and fires off phone number.
GiftcardSchema.methods.sendTextToFriend = function(friendNumber) {
   //TODO: implement method that fire off text.
   //TODO: implement method that checks timer, and sends message delayed.
   //NOTE: This method needs to check the date and make sure it knows when to
   //fire off later. Need to research cron jobs though.

   return client.messages.create({
      body: 'You have a new giftcard in your account!',// put link in to log user in and view list of cards.
      to: '+1'+friendNumber,
      from: '+15624454688',
   }, function(err, message) {
      if (err) {
         console.log(err);
      }
      if (message) {
         console.log(message.sid);
      }
   });
};

mongoose.model('Giftcard', GiftcardSchema);
