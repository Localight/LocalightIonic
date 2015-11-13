'use strict';

/**
 * @ngdoc function
 * @name angularLocalightApp.controller:LocalismCtrl
 * @description
 * # LocalismCtrl
 * Controller of the angularLocalightApp
 */
angular.module('angularLocalightApp')
  .controller('LocalismCtrl', function ($scope, $cookies, rotationCheck, Giftcards, loadingSpinner) {

        this.awesomeThings = [
          'HTML5 Boilerplate',
          'AngularJS',
          'Karma'
        ];

        //Initialize the loading service
        $scope.loadHandler = loadingSpinner.loading;
        $scope.errorHandler = loadingSpinner.error;

        //Reset the rotation alert boolean
        rotationCheck.reset();

        //get our session token from the cookies
        var sessionToken = $cookies.get("sessionToken");

		//Initialize scope.giftcards
		$scope.giftcards = null;

        // Find a list of Giftcards
    	$scope.getGiftcards = function() {

            //Start loading
            var loadRequest = loadingSpinner.load("Getting Giftcards...");

            //First set up some JSON for the session token
            var payload = {
                "sessionToken" : sessionToken
            }

            //Query the backend using our session token
            Giftcards.get(payload,
            function(data, status) {
                ///Success save giftcards in scope
                $scope.giftcards = data;

                //Get the total value of all the Giftcards
                $scope.getTotalValue();

                //Stop Loading
                loadingSpinner.stopLoading(loadRequest);
            },

            function(err)
            {
                //Stop Loading
                loadingSpinner.stopLoading(loadRequest);

                //Error, Inform the user of the status
                if (err.status == 401) {
                   //Session is invalid! Redirect to 404
                   $location.path("/");

                   //Show an error
                   loadingSpinner.showError("No Session Found!","Session Token is invalid");
                } else {

                    //An unexpected error has occured, log into console
                    loadingSpinner.showError("Status: " + err.status + " " + err.data.msg,
                    "Status: " + err.status + " " + err.data.msg);
                }
            });
    	}

        //The total value of all of the user's giftcards
        $scope.totalValue = "";
        $scope.getTotalValue = function()
        {
            //Get the total value of all the giftcards
            var total = 0;
            for(var i = 0; i < $scope.giftcards.length; ++i)
            {
                total = total + parseInt($scope.giftcards[i].amount, 10);
            }

            //Return the total value as a formatted string
            $scope.totalValue = (parseInt(total) / 100).toFixed(2);
        }

  });
