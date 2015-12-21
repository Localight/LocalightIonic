// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular
  .module('localightApp', [
    'ionic',
    'ngCordova',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'duScroll',
    'envConfig',
    'angular-datepicker',
  ])

  .config(function ($routeProvider, $httpProvider) {

  //Our Routes for the app
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    })
    .when('/giftcards/create', {
      templateUrl: 'views/giftCreate.html',
      controller: 'CreategiftcardCtrl',
      controllerAs: 'createGiftcard'
    })
    .when('/giftcards', {
      templateUrl: 'views/giftList.html',
      controller: 'ListgiftcardsCtrl',
      controllerAs: 'listGiftcards'
    })
    .when('/giftcards/:giftcardId', {
      templateUrl: 'views/giftView.html',
      controller: 'ViewgiftcardCtrl',
      controllerAs: 'viewGiftcard'
    })
    .when('/merchants', {
      templateUrl: 'views/merchants.html',
      controller: 'MerchantsCtrl',
      controllerAs: 'merchants'
    })
    .when('/merchants/:merchantId/amount', {
      templateUrl: 'views/enterAmount.html',
      controller: 'EnterAmountCtrl',
      controllerAs: 'enterAmount'
    })
    .when('/merchants/:merchantId/tilt', {
      templateUrl: 'views/tiltScreen.html',
      controller: 'TiltScreenCtrl',
      controllerAs: 'tiltScreen'
    })
    .when('/merchants/:merchantId/tricon', {
      templateUrl: 'views/tricon.html',
      controller: 'TriconCtrl',
      controllerAs: 'tricon'
    })
    .when('/merchants/:merchantId/confirmation', {
      templateUrl: 'views/confirmTimeout.html',
      controller: 'ConfirmationTimeoutCtrl',
      controllerAs: 'confirmationTimeout'
    })
    .when('/merchants/:merchantId/thankyou', {
      templateUrl: 'views/thankYou.html',
      controller: 'ThankyouCtrl',
      controllerAs: 'thankyou'
    })
    .when('/localism', {
      templateUrl: 'views/localism.html',
      controller: 'LocalismCtrl',
      controllerAs: 'localism'
    })
    .when('/sent', {
      templateUrl: 'views/confirmSent.html',
      controller: 'SentconfirmationCtrl',
      controllerAs: 'sentConfirmation'
    })
    .when('/dashboard/request', {
      templateUrl: 'views/dashboard/dashSignup.html',
      controller: 'SignuppanelCtrl',
      controllerAs: 'signupPanel'
    })
    .when('/dashboard/login', {
      templateUrl: 'views/dashboard/dashLogin.html',
      controller: 'LoginpanelCtrl',
      controllerAs: 'loginPanel'
    })
    .when('/dashboard/main', {
      templateUrl: 'views/dashboard/dashList.html',
      controller: 'MainpanelCtrl',
      controllerAs: 'mainPanel'
    })
    .when('/dashboard/createlocation', {
      templateUrl: 'views/dashboard/locationCreate.html',
      controller: 'CreatelocationCtrl',
      controllerAs: 'createlocation'
    })
    .when('/dashboard/editlocation/:locationId', {
      templateUrl: 'views/dashboard/locationEdit.html',
      controller: 'EditlocationCtrl',
      controllerAs: 'editlocation'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard/dashHome.html',
      controller: 'DashboardCtrl',
      controllerAs: 'dashboard'
    })
    .when('/dashboard/followup', {
      templateUrl: 'views/dashboard/followup.html',
      controller: 'FollowupCtrl',
      controllerAs: 'followUp'
    })
    .when('/dashboard/additionalinfo', {
      templateUrl: 'views/dashboard/additionalinfo.html',
      controller: 'AdditionalinfoCtrl',
      controllerAs: 'additionalinfo'
    })
    .when('/terms', {
      templateUrl: 'views/terms.html',
      controller: 'TermsCtrl',
      controllerAs: 'terms'
    })
    .otherwise({
      redirectTo: '/'
    });



    //Our Error Handler
    $httpProvider.interceptors.push(function($q, $location, loadingSpinner) {
        return {

            //Called when a request is made to a server
            'request': function(config) {

                //First check if it is to a backend or external site
                if(config.url.indexOf("http://") > -1 ||
                config.url.indexOf("https://") > -1) {

                    //Get our Server Route
                    var route = config.url.substring(config.url.indexOf("/", 8));

                   //Start loading
                   loadingSpinner.load(loadingSpinner.getMessage(route), route);
                }

                //Return the config to complete the request
               return config;
             },

               // Called When we get a successful response
               'response': function(response) {

                   //Stop loading the request

                   if(response.config.url.indexOf("http://") > -1 ||
                   response.config.url.indexOf("https://") > -1) {
                       //Get our Server Route
                       var route = response.config.url.substring(response.config.url.indexOf("/", 8));

                       //Stop Loading
                       loadingSpinner.stopLoading(route);
                   }

                   //Return the response to the applicatrion
                  return response;
               },

              //Errors, Called when error happens
              'responseError': function(response) {

                  //Get our Server Route
                  var route = response.config.url.substring(response.config.url.indexOf("/", 8));

                if (response.status == 401) {
                    //Handle 401 error code

                    //Session is invalid! Redirect to 404, only if not a login page
                    if(route.indexOf("/login") == -1) $location.path("/");

                    //Show an error
                    loadingSpinner.showError("No Session Found!",
                    "Session Token is invalid", route);
                }
                else if (response.status == 500) {
                  // Handle 500 error code
                  loadingSpinner.showError("Status: " + response.status + ", The server had an error, or you've been directed to an incorrect page",
                  "Status: " + response.status + ", The server had an error, or you've been directed to an incorrect page",
                  route);
                }
                else {
                    //Handle General Error

                    //An unexpected error has occured, log into console
                    loadingSpinner.showError("Status: " + response.status + ", Something went wrong, please contact the developers",
                    "Status: " + response.status + ", Something went wrong, please contact the developers",
                    route);
                }

                // Always reject (or resolve) the deferred you're given
                return $q.reject(response);
              }


            };
      });
  })


//https://github.com/driftyco/ionic/issues/2911
.run(function($ionicPlatform, ENV) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);


      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      //Made keyboard worse
      //cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
    // Set the statusbar to use the default style, tweak this to
        // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }

  });
})
