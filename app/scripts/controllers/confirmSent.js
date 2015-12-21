'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:SentconfirmationCtrl
 * @description
 * # SentconfirmationCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('SentconfirmationCtrl', function ($scope, $cookies) {

    //Display the phone number and email to the user, and then remove them from the cookies
    $scope.getInit = function()
    {
        //Place our cookies in scope variables and then remove the cookies
        $scope.phoneNum = $cookies.get("phone");
        $scope.email = $cookies.get("email");

        //Remove the cookies
        $cookies.remove("phone");
        $cookies.remove("email");
    }

    //Init
    $scope.getInit();

  });
