'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:LoginpanelCtrl
 * @description
 * # LoginpanelCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('LoginpanelCtrl', function ($scope, $cookies, $location, LoginOwner, loadingSpinner) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Boolean to show an error to the user
    $scope.submitError;

    //Log in our owner!
    $scope.login = function() {

        //First set up some JSON for the session token
        var payload = {
           "email" : $scope.email,
           "password" : $scope.password
        }

        //Set our message for the loading spinner
        loadingSpinner.setMessage("/owners/login", "Logging You In...", true);

        //Login the user, submit the payload to the backend
        LoginOwner.submit(payload,
        function(data, status) {

            //Success, save the response in scope
            $scope.owner = data;

            //Check if they are verfied
            if(!$scope.owner.verified)
            {
                //They are not verified go straight to the followup page
                $location.path("/dashboard/followup");
            }
            else {

                //Save their session token
                $cookies.put("sessionToken", $scope.owner.token);

                //Check if they have completed additional info
                if($scope.owner.dob) {
                    //redirect to the main page
                    $location.path("/dashboard/main");
                }
                else {
                    //redirect to the additional info page
                    $location.path("/dashboard/additionalinfo");
                }
            }
        },
        function(err) {

            //Create the error object
            $scope.error = {
                isError : true,
                text: ""
            };

            if(err.status == 401)
            {
                $scope.error.text = "Sorry, the entered account information is incorrect.";
            }
            else {
                $scope.error.text = "Sorry, an error has occured connecting to the database";
            }
        });
    }

  });
