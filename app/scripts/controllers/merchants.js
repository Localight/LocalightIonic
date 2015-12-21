'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:MerchantsCtrl
 * @description
 * # MerchantsCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('MerchantsCtrl', function ($scope, rotationCheck, Giftcards, Locations, $cookies, $location, loadingSpinner) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Reset the rotation alert boolean
    rotationCheck.reset();

	//Initialize our giftcards in scope
	$scope.giftcards;

    //Initialize our merchants in scope
	$scope.merchantsArray;

    //Get our session token from the cookies
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

    //Get the intended merchant
    $scope.intendedMerchant;

    if($location.search().merchant)
    {
        //get our intended Merchant id
        $scope.intendedMerchant = $location.search().merchant;

        //Getting this individual
        //location will be done in the get location
    }

    $scope.getLocations = function() {

        //Set our message for the loading spinner
        loadingSpinner.setMessage("/locations", "Getting Locations...");

        //Json to send to the backend
        var payload = {
            "sessionToken" : sessionToken
        }

        //Send the payload to the backend to get the locations
        Locations.get(payload,
        function(data, status) {

            //Success save the response to scope
            $scope.merchantsArray = data;

            //Find the location with the id from the query param
            if($scope.intendedMerchant)
            {
                for(var i = 0; i < data.length; i++)
                {
                    if(data[i]._id == $scope.intendedMerchant)
                    {
                        //Save the object, and break the loop
                        $scope.intendedMerchant = data[i];
                        break;
                    }
                }
            }

            //Now get all of the giftcards for our navbar
            $scope.getGiftcards();
        });
    }


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

            //the values of the giftcards
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

    //Remove the sender's id for the thank you page
    $scope.senderId = function () {
        //put the sender into cookies to retrieve later
        $cookies.remove('senderName');
        $cookies.remove('senderId');
        $cookies.remove('senderIcon');

        //Remove the merchants query param
        $location.url($location.path());

        //Change locations to the merchants page
        $location.path("/giftcards");
    }



    //Init
    $scope.getLocations();

  });
