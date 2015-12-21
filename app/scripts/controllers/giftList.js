'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:ListgiftcardsCtrl
 * @description
 * # ListgiftcardsCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('ListgiftcardsCtrl', function ($scope, $cookies, Giftcards, rotationCheck,
      $location, GivenGifts, loadingSpinner, OccasionService) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Reset the rotation alert boolean
    rotationCheck.reset();

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

		//Initialize scope.giftcards
		$scope.giftcards = null;
        $scope.sentGiftcards = null;

        // Find a list of Giftcards
    	$scope.getGiftcards = function() {

            //First set up some JSON for the session token
            var payload = {
                "sessionToken" : sessionToken
            }

            //Set our message for the loading spinner
            loadingSpinner.setMessage("/giftcards", "Getting Giftcards...");

            //Query the backend using our session token
            Giftcards.get(payload, function(data, status) {

                //Success save giftcards in scope
                $scope.giftcards = data;

                //Also get the total value
                $scope.getTotalValue();

                //Get the user's sent giftcards
                $scope.getSentGiftcards();
            });
    	}

        // Find a list of the given Giftcards
    	$scope.getSentGiftcards = function() {

            //First set up some JSON for the session token
            var payload = {
                "sessionToken" : sessionToken
            }

            loadingSpinner.setMessage("/giftcards/given", "Getting Given Giftcards...");

            //Query the backend using our session token
            GivenGifts.get(payload,
            function(data, status) {

                ///Success save giftcards in scope
                $scope.sentGiftcards = data;
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

        //function to return if a giftcard is spent
        $scope.isSpent = function(giftcard)
        {
            return (giftcard.amount <= 0);
        }

        //function to return if a giftcard is not spent
        //Angular filters cannot be done in reverse
        $scope.isNotSpent = function(giftcard)
        {
            return (giftcard.amount > 0);
        }

        //Function to return a date's date, not time
        $scope.getDate = function(date) {
            var d = new Date(date);
            var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            return months[d.getMonth()] + " " + d.getDay() + ", " + d.getFullYear();
        }

        //Function to go to another url, if giftcards is not zero
		$scope.goTo = function(place)
		{
			//Save our final amount if the path is to pay
			if($scope.giftcards.length > 0)
			{
			    $location.path(place);
            }
		}

        //Return an occasion icon
        $scope.getOccasion = function(Id) {
            return OccasionService.getOccasionsById(Id);
        }



        //Init
        $scope.getGiftcards();

  });
