'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:LocalismCtrl
 * @description
 * # LocalismCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('LocalismCtrl', function ($scope, $cookies, rotationCheck, Giftcards, loadingSpinner) {

        this.awesomeThings = [
          'HTML5 Boilerplate',
          'AngularJS',
          'Karma'
        ];

        //Reset the rotation alert boolean
        rotationCheck.reset();

        //get our session token from the cookies
        var sessionToken = $cookies.get("sessionToken");

        //Get our thanks
        $scope.sentThanks = false;
        if($cookies.get("thanks"))
        {
            $scope.sentThanks = true;
            $cookies.remove("thanks");
        }

		//Initialize scope.giftcards
		$scope.giftcards = null;

        // Find a list of Giftcards
    	$scope.getGiftcards = function() {

            //Set our message for the loading spinner
            loadingSpinner.setMessage("/giftcards", "Getting Giftcards...");

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



        //Init
        $scope.getGiftcards();

  });
