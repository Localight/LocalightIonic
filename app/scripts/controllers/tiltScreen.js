'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:TiltScreenCtrl
 * @description
 * # TiltScreenCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('TiltScreenCtrl', function ($scope, $location, $routeParams, $cookies, $timeout, LocationById, rotationCheck, loadingSpinner) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

        //Reset the rotation alert boolean
        rotationCheck.reset();

		//Get our merchant ID from the url
		$scope.Id = $routeParams.merchantId;

        //get our session token from the cookies
        var sessionToken;

        if($cookies.get("sessionToken"))
        {
            sessionToken = $cookies.get("sessionToken");
        }
        else
        {
            //Redirect them to a 404
            $location.path("#/");
        }

        //Get our location
        $scope.getLocation = function() {

            //First set up some JSON for the session token
            var payload = {
                "id" : $scope.Id,
                "sessionToken" : sessionToken
            }

            //Set our message for the loading spinner
            loadingSpinner.setMessage("/locations/" + $scope.Id, "Getting Location...");

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
				$scope.goTo("/merchants/" + $scope.Id + "/amount");
			}
			return (parseInt(amount) / 100).toFixed(2);
		}

		//Function to go to the route provided in the params
		$scope.goTo = function(place)
		{
			//Save our final amount if the path is to pay,
            //also animate the lock before leaving
			if(place.indexOf("tricon") > -1)
			{
                //Add the animate class to the lock
                document.getElementById("theLock").className = document.getElementById("theLock").className + " animateLock"

                //Timeout to the next page, keep current with .animateLock animate time
                $timeout(function () {
                    $location.path(place);
                }, 1000);
			}
			else $location.path(place);
		}



        //Init
        $scope.getLocation();

  });
