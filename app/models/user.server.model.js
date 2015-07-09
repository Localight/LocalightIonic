'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
   return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
   return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
   //TODO: work on user crdentials.
   //TODO: convert username to only accept strings related to mobile numbers.
   /**
    * firstName, the first name of the user, most of the time what we display in app. Must be String all alpha characters, 3 - 35 characters long. no spaces
    * @type {String}
    */
   firstName: {
      type: String,
      trim: true,
      default: '',
//      validate: [validateLocalStrategyProperty, 'Please fill in your first name']
   },
   /**
    * lastName, the last name of the user, most of the time what we display in app. Must be String all alpha characters, 3 - 35 characters long. no spaces
    * @type {String}
    */
   lastName: {
      type: String,
      trim: true,
      default: '',
   //   validate: [validateLocalStrategyProperty, 'Please fill in your last name']
   },
   // display Name, should not store, but generate when needed.
   // displayName: {
   //    type: String,
   //    default: '',
   //    validate: [validateLocalStrategyProperty, 'Please fill in your full Name']
   // },

   ///////////////STRIPE API STUFF  ////////////////////////
   /**
    * stripeCustomerToken, this token is given to use from from stripe. It should
    * be paired with the user's information, all customers are managed:true.
    * this key should be created the same time a user signs up with our service.
    * are flaged as customers.
    * @type {Object}
    */
   stripeCustomerToken: {
      type: String,
      //TODO: add regular expression for customer Token, using match.
      match: [/cus_[\w\d._%+-]+/, 'This value entered for the Stripe Customer Token does not match the correct format ({VALUE})'],
      required: 'Stripe Customer Token Required.'
   },
   stripeCardToken: {
      // A user may only have one primary card.
      primary: {
         // TODO: add regularexpression for card tokens, using "match"
         match: [/card_[\w\d._%+-]+/, 'This value entered for the Stripe Card Token does not match the currect format ({VALUE})'],
         type: String,
      },
      secondary: [{
         // TODO: add regularexpression for card tokens, using "match"
         match: [/card_[\w\d._%+-]+/, 'This value entered for the Stripe Card Token does not match correct format ({VALUE})'],
         type: String,
      }],
   },
   /**
    * The stripe Account Token is only used when if the
    * user has signed up as a merchant. This essentially is how a user get's paid.
    *
    * @type {String}
    */
   stripeAccountToken: {
      // add regularexpression for card token, using "match"
      match: [/acct_[\w\d._%+-]+/, 'This value entered for the Stripe Account Token does not match ({VALUE})'],
      type: String
   },
   ///////////////////////////////////////////////////

   /**
    * [hasCompletedSignup If a user signedup through the form this should be true, otherwise false when a new user is added through twilio.]
    * @type {Boolean}
    */
   hasCompletedSignup: {
      type: Boolean,
      default: false,
   },
   textToken:{
      type:String
   },
   textTokenExpires:{
      type:Date
   },
   email: {
      type: String,
      trim: true,
      default: '',
      //validate: [validateLocalStrategyProperty, 'Please fill in your email'],
      match: [/.+\@.+\..+/, 'Please fill a valid email address']
   },
   /**
    * username, probably the most important fact about this is that the username
    * is actually the user's phone number. This is kinda a hack, but DW wanted it
    * to work like this for now. If a user get's a new number, then we enter a
    * new way for that to work. For now we make sure that the username is validate
    * like a phone number, no spaces or dashes, and no 1 attached.
    * @type {Object}
    */
   username: {
      type: String,
      trim: true,
      unique: 'testing error message',
      match: [/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/, 'Please fill a valid ten-digit phone number'], // should match the format of a string phonenumber
      required: 'Please fill in a mobile number',

   },
   // if a user wants to
   password: {
      type: String,
      default: '',
      	//validate: [validateLocalStrategyPassword, 'Password should be longer']
   },
   salt: {
      type: String
   },
   provider: {
      type: String,
      required: 'Provider is required'
   },
   providerData: {},
   additionalProvidersData: {},
   roles: {
      type: [{
         type: String,
         enum: ['user', 'merchant', 'customer', 'admin']
      }],
      default: ['user']
   },
   updated: {
      type: Date
   },
   created: {
      type: Date,
      default: Date.now
   },
   /* For reset password */
   resetPasswordToken: {
      type: String
   },
   resetPasswordExpires: {
      type: Date
   }
});

// UserSchema.virtual('name.full').get(function() {
//    return this.firstName + ' ' + this.lastName;
// });

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
   if (this.password && this.password.length > 6) {
      this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
      this.password = this.hashPassword(this.password);
   }
   next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
   if (this.salt && password) {
      return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
   } else {
      return password;
   }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
   return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
   var _this = this;
   var possibleUsername = username + (suffix || '');

   _this.findOne({
      username: possibleUsername
   }, function(err, user) {
      if (!err) {
         if (!user) {
            callback(possibleUsername);
         } else {
            return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
         }
      } else {
         callback(null);
      }
   });
};

mongoose.model('User', UserSchema);
