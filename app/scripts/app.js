'use strict';

/**
 * @ngdoc overview
 * @name angularLocalightApp
 * @description
 * # angularLocalightApp
 *
 * Main module of the application.
 */
angular
  .module('angularLocalightApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'duScroll',
    'envConfig',
    'angular-datepicker'
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
      $httpProvider.interceptors.push(function($q, loadingSpinner) {
          return {

              //Called when a request is made to a server
              'request': function(config) {
                 // do something on success
                 console.log(config);
                 return config;
               },

            //Errors, Called when error happens
            'responseError': function(response) {
              if (response.status == 401) {
                  //Handle 401 error code

                  //Session is invalid! Redirect to 404
                  $location.path("/");

                  //Show an error
                  loadingSpinner.showError("No Session Found!","Session Token is invalid");
              }
              else if (response.status == 500) {
                // Handle 500 error code
              }
              else {
                  //Handle General Error

                  //An unexpected error has occured, log into console
                  loadingSpinner.showError("Status: " + err.status + " " + err.data.msg,
                  "Status: " + err.status + " " + err.data.msg);
              }

              // Always reject (or resolve) the deferred you're given
              return $q.reject(response);
            }


          };
        });


  });
