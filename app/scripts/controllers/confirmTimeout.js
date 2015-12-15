'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:ConfirmationTimeoutCtrl
 * @description
 * # ConfirmationTimeoutCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('ConfirmationTimeoutCtrl', function ($scope, $timeout, $location, $routeParams, $cookies, LocationById, loadingSpinner) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //get our session token from the cookies
    var sessionToken = $cookies.get("sessionToken");

    //Get our merchant ID
    var merchantId = $routeParams.merchantId;

    //Timeout, the redirect to the next page
    $timeout(timeoutRedirect, 2000);

        //Get our location
        $scope.getLocation = function() {

            //Set our message for the loading spinner
            loadingSpinner.setMessage("/locations/" + $scope.Id, "Getting Location...");

            //First set up some JSON for the session token
            var payload = {
                "id" : merchantId,
                "sessionToken" : sessionToken
            }

            //Send the payload to the backend
            LocationById.get(payload,
                function(data, status) {

                //Success! Save the response to our scope!
                $scope.merchantLocation = data;

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


        //Init
        $scope.getLocation();

  });
