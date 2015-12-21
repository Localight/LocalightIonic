'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:AdditionalinfoCtrl
 * @description
 * # AdditionalinfoCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('AdditionalinfoCtrl', function ($scope, $cookies, $location, $timeout, Owners, loadingSpinner) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Initialize the loading service
    $scope.loadHandler = loadingSpinner.loading;
    $scope.errorHandler = loadingSpinner.error;

    //Grab our session token from the cookies
    var sessionToken = $cookies.get("sessionToken");

    //Update the owner
    $scope.updateOwner = function() {

        //Create the payload
        var payload = {
            token : sessionToken,
            dob: $scope.formData.dob
        };

        //Set our message for the loading spinner
        loadingSpinner.setMessage("/owners", "Updating Your Account...");

        //Send the payload to update the owner
        Owners.update(payload, function(data, status) {

            //Everything is good, redirect to the location create page
            $location.path("/dashboard/createlocation");
        });
    }


  });
