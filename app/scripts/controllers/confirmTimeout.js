'use strict';

/**
 * @ngdoc function
 * @name angularLocalightApp.controller:ConfirmationTimeoutCtrl
 * @description
 * # ConfirmationTimeoutCtrl
 * Controller of the angularLocalightApp
 */
angular.module('angularLocalightApp')
  .controller('ConfirmationTimeoutCtrl', function ($scope, $timeout, $location, $routeParams, $cookies, LocationById, loadingSpinner) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Initialize the loading service
    $scope.loadHandler = loadingSpinner.loading;
    $scope.errorHandler = loadingSpinner.error;

    //get our session token from the cookies
    var sessionToken = $cookies.get("sessionToken");

    //Get our merchant ID
    var merchantId = $routeParams.merchantId;

    //Timeout, the redirect to the next page
    $timeout(timeoutRedirect, 2000);

        //Get our location
        $scope.getLocation = function() {

            //Start loading
            var loadRequest = loadingSpinner.load("Getting Location...");

            //First set up some JSON for the session token
            var payload = {
                "id" : merchantId,
                "sessionToken" : sessionToken
            }

            //Send the payload to the backend
            LocationById.get(payload,
                function(data, status) {

                //Stop Loading
                loadingSpinner.stopLoading(loadRequest);

                //Success! Save the response to our scope!
                $scope.merchantLocation = data;

            }, function(err) {

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

		//Get the amount we are going to send the server
		$scope.getAmount = function()
		{
			//Retrive the cookie with our amount
			var amount = $cookies.get("igosdmbmtv");
			if(!amount)
			{
                //Redierect to the amount screen if there is no amount cookie
				$scope.goTo("/merchants/" + merchantId + "/amount");
			}
			return (parseInt(amount) / 100).toFixed(2);
		}

		//Redirect to the thank you page
		function timeoutRedirect()
		{
    		$location.path("/merchants/" + merchantId + "/thankyou");
		}

  });
