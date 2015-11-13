'use strict';

/**
 * @ngdoc function
 * @name angularLocalightApp.controller:SignuppanelCtrl
 * @description
 * # SignuppanelCtrl
 * Controller of the angularLocalightApp
 */
angular.module('angularLocalightApp')
  .controller('SignuppanelCtrl', function ($scope, $cookies, $location, $timeout, JoinOwner, loadingSpinner) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Initialize the loading service
    $scope.loadHandler = loadingSpinner.loading;
    $scope.errorHandler = loadingSpinner.error;

    //Boolean for if we receive errors
    $scope.submitError;

    //Sign up our owner!
    $scope.signUp = function() {

        //First check if their passwords match
        if($scope.formData.password.indexOf($scope.formData.confirmPassword) < 0)
        {
            $scope.submitError = true;
            $scope.theError = "Passwords do not match!";
            return;
        }

        //Create the error object
        $scope.error = {
            isError : false,
            text: ""
        };

        //Regex for all valid emails. To add a TLD, edit the final OR statement.
        var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|co|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
        //Test the form email against the regex
        if (!emailRegex.test($scope.formData.email)) {
            $scope.error.text = "Sorry, thats not a valid email.";
        } else {
            //New owner payload
            var payload = {
               "company": $scope.formData.bName,
               "name": $scope.formData.fName + " " + $scope.formData.lName,
               "email": $scope.formData.email,
               "password": $scope.formData.password,
               //Legacy
               "stripeCustomerId": "0"
            }

            //Start loading
            var loadRequest = loadingSpinner.load("Signing you in...");

            JoinOwner.submit(payload,
            function(data, status){

                //Success, save the response from the backend
                $scope.owner = data;

                //Save their session token
                $cookies.put("sessionToken", $scope.owner.token);

                //Finally redirect to the main page
                $location.path("/dashboard/main");

                //Stop Loading
                loadingSpinner.stopLoading(loadRequest);
            },
            function(err)
            {
                //Create the error object
                $scope.error = {
                    isError : true,
                    text: ""
                };
                
                if(err.status == 401)
                {
                    $scope.error.text = "Sorry, the entered account information is incorrect.";
                }
                else if(err.status == 409) {
                    $scope.error.text = "Sorry, e-mail already exists.";
                }
                else {
                    $scope.error.text = "Sorry, an error has occured connecting to the database";
                }

                //Stop Loading
                loadingSpinner.stopLoading(loadRequest);
            });
        }


    }
  });
