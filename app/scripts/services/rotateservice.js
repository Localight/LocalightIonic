'use strict';

/**
 * @ngdoc service
 * @name localightApp.rotateService
 * @description
 * # rotateService
 * Service in the localightApp.
 */
angular.module('localightApp')
  .service('rotationCheck', function ($window, $ionicPopup) {

      //Boolean to alert rotation to the user
      var rotateAlert = false;


      //Check for device orientation
      $window.addEventListener("orientationchange", function() {
          if(!rotateAlert && ($window.orientation == -90 || $window.orientation == 90))
          {
              rotateAlert = true;


              var alertPopup = $ionicPopup.alert({
                  title: 'Localight',
                  template: 'Please disable device rotation, this application is meant to be used in portrait mode. You could risk spending a giftcard incorrectly, or losing your data.'
                });
                alertPopup.then(function(res) {
                });
          }
      }, false);

      return {

          //Function to reset the alert
          reset: function () {
              //Reset the Boolean
              rotateAlert = false;
          }
      }
  });
