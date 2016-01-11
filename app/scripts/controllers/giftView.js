'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:ViewgiftcardCtrl
 * @description
 * # ViewgiftcardCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('ViewgiftcardCtrl', function ($scope, $routeParams, $cookies, GiftcardById, Giftcards,
      rotationCheck, $location, loadingSpinner, OccasionService) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

        //Reset the rotation alert boolean
        rotationCheck.reset();

        //Boolean if the giftcard can be spent
        $scope.isValid;

		//Initialize giftcards in scope
		$scope.giftcard;

        //Get our giftcard id from the url
        var giftcardId = $routeParams.giftcardId;

        //Get the session token from the cookies
        var sessionToken;
        //Scope session token for going to the giftcard create page
        $scope.sessionToken = "";

        if($location.search().token)
        {
            //get our session token
            sessionToken = $location.search().token;

            //also save in scope
            $scope.sessionToken = sessionToken;

            //Place the session token in the cookies
            $cookies.put("sessionToken", sessionToken);
        }
        else if($cookies.get("sessionToken"))
        {
            //get our session token from the cookies
            sessionToken = $cookies.get("sessionToken");

            //also save in scope
            $scope.sessionToken = sessionToken;
        }
        else {
            //Redirect them to a 404
            $location.path("#/");
        }

        // Find a list of Giftcards (For our total value)
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

                //Also get the total value
                $scope.getTotalValue();
            });
    	}

        // Get the Selected Giftcard
    	$scope.getGiftcard = function() {

            //First set up some JSON for the session token
            var payload = {
                "sessionToken" : sessionToken,
                "id": giftcardId
            }

            //Set our message for the loading spinner
            loadingSpinner.setMessage("/giftcards/" + giftcardId, "Getting Received Giftcard...");

            //Query the backend using our session token
            GiftcardById.get(payload,
            function(data, status) {
                ///Success save giftcards in scope
                $scope.giftcard = data;

                //Check if the giftcard can be used, aka non-zero amount
                if($scope.giftcard.amount > 0) $scope.isValid = true;

                //Now get all of the giftcards
                $scope.getGiftcards();
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

        //Save the sender's id for the thank you page
        $scope.senderId = function () {
            //put the sender into cookies to retrieve later
            $cookies.put('senderName', $scope.giftcard.fromId.name);
            $cookies.put('senderId', $scope.giftcard.fromId._id);
            $cookies.put('senderIcon', $scope.giftcard.iconId);

            //Change locations to the merchants page, and include the location id
            $location.path("/merchants").search({merchant: $scope.giftcard.location.locationId._id});
        }


        //Return an occasion icon
        $scope.getOccasion = function(Id) {
            return OccasionService.getOccasionsById(Id);
        }


        //Init
         //Init giftcard with fake data to avoid
         //displaying alot of broken weirdness
         $scope.giftcard = {
             _id: "0",
             fromId: {
                 name: "From"
             },
             toId: {
                 name: "To"
             },
             amount: 0,
             origAmount: 7500,
             iconId: 9,
             message: "Enjoy your gift!",
             thanked: false,
             created: "2015-12-15T18:41:07.137Z",
             location: {
                 locationId: {
                     _id: "0",
                     address1: "240 Pine Ave",
                     city: "Long Beach",
                     name: "MADE in Long Beach",
                     state: "CA",
                     subs: [],
                     zipcode: "90802"
                 }
             }
         };
        $scope.getGiftcard();
  });
