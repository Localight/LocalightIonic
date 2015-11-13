'use strict';

/**
 * @ngdoc function
 * @name angularLocalightApp.controller:ListgiftcardsCtrl
 * @description
 * # ListgiftcardsCtrl
 * Controller of the angularLocalightApp
 */
angular.module('angularLocalightApp')
  .controller('ListgiftcardsCtrl', function ($scope, $cookies, Giftcards, rotationCheck, $location, GivenGifts, loadingSpinner) {

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

            //Start loading
            var loadRequest = loadingSpinner.load("Getting Giftcards...");

            //First set up some JSON for the session token
            var payload = {
                "sessionToken" : sessionToken
            }

            //Query the backend using our session token
            Giftcards.get(payload, function(data, status) {

                //Stop Loading
                loadingSpinner.stopLoading(loadRequest);

                ///Success save giftcards in scope
                $scope.giftcards = data;

                //Also get the total value
                $scope.getTotalValue();

                //Get the user's sent giftcards
                $scope.getSentGiftcards();
            },

            function(err)
            {
                //Stop the loading spinner
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

        // Find a list of the given Giftcards
    	$scope.getSentGiftcards = function() {

            //Start loading
            var loadRequest = loadingSpinner.load("Getting Sent Giftcards...");

            //First set up some JSON for the session token
            var payload = {
                "sessionToken" : sessionToken
            }

            //Query the backend using our session token
            GivenGifts.get(payload,
            function(data, status) {

                //Stop the loading spinner
                loadingSpinner.stopLoading(loadRequest);

                ///Success save giftcards in scope
                $scope.sentGiftcards = data;
            },

            function(err)
            {
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

		//Array of occasion Icons, simply a link to their icon
		$scope.icons =
		[
			//Anniversary
			"/../images/occasion-anniversary-icon-wht.png",
			//Baby
			"/../images/occasion-baby-icon-wht.png",
			//Birthday
			"/../images/occasion-birthday-icon-wht.png",
			//Congrats
			"/../images/occasion-congrats-icon-wht.png",
			//Present (Custom Icon)
			"/../images/occasion-custom-icon-wht.png",
			//Get Well Soon
			"/../images/occasion-getwell-icon-wht.png",
			//Love
			"/../images/occasion-love-icon-wht.png",
			//Sympathy
			"/../images/occasion-sympathy-icon-wht.png",
			//Thank You
			"/../images/occasion-thankyou-icon-wht.png",
			//Wedding
			"/../images/occasion-wedding-icon-wht.png"
		]

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

        //Function to go to another url, if giftcards is not zero
		$scope.goTo = function(place)
		{
			//Save our final amount if the path is to pay
			if($scope.giftcards.length > 0)
			{
			    $location.path(place);
            }
		}

  });
