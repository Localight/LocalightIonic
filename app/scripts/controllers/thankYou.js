'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:ThankyouCtrl
 * @description
 * # ThankyouCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('ThankyouCtrl', function ($scope, $routeParams, $cookies, $timeout, $location, $window, rotationCheck,
      Giftcards, LocationById, Thanks, loadingSpinner, OccasionService) {

      //Reset the rotation alert boolean
      rotationCheck.reset();

      //Initialize our giftcards in scope
      $scope.giftcards;

      //Our character count for the text area
      $scope.charCount;

      //Total purcahse value
      $scope.purchaseValue;

      //Get our merchant ID
      $scope.Id = $routeParams.merchantId;

      //Get our amount
      $scope.spentAmount = (parseInt($cookies.get("igosdmbmtv")) / 100).toFixed(2);
      $cookies.remove("igosdmbmtv");

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

            $timeout(function(){
                if($scope.sender.name == "Localight"){
                    //Initialize our thanks message
                    $scope.thanksMessage = $scope.sender.name +
                    ", make this app experience better by adding/improving...";
                    $scope.thanksHeader = " a suggestion to ";
                } else {
                    //Initialize our thanks message
                    $scope.thanksMessage = $scope.sender.name +
                    " I used the Local Giftcard at " + $scope.merchantLocation.name +
                    " to get ...";
                    $scope.thanksHeader = " a thank you to ";
                }
            }, 200);

        });
    }


	//Prepare our text area
	$scope.setTextArea = function ()
	{
		//Set the default value of our text area
		document.getElementById("thankYouNote").value = sender.name +
        ", I used the Local Giftcard at " +
        $scope.merchantLocation.name + " to get...";
	}

	//Count our text area characters
	$scope.countCharacters = function()
	{
		$scope.charCount = 160 - document.getElementById("thankYouNote").value.length;
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

            //Get the total value of all the Giftcards
            $scope.getTotalValue();

            //Get our user who sent the giftcard
            $scope.sender = {};
            if($cookies.get("senderName"))
            {
                $scope.sender = {
                    "name": $cookies.get("senderName"),
                    "id": $cookies.get("senderId"),
                    "icon": $cookies.get("senderIcon")
                }

                $cookies.remove("senderName");
                $cookies.remove("senderId");
                $cookies.remove("senderIcon");
            }
            else {
                //Make the oldest, non thanked giftcard the sender since its the one we spent
                for(var i = $scope.giftcards.length - 1; i >= 0; i--)
                {
                    if(!$scope.giftcards[i].thanked || i == 0)
                    {
                        $scope.sender = {
                            "name": $scope.giftcards[i].fromId.name,
                            "id": $scope.giftcards[i].fromId._id,
                            "icon": $scope.giftcards[i].iconId
                        }

                        //Since we got what we needed, BREAK, and be efficient
                        break;
                    }
                }
            }

            //Now query the backend for the location
            $scope.getLocation();

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

	//Function to go back to a page passed in params
	$scope.goTo = function(place) {
		$location.path(place);
	}

    //Send the thank you
    $scope.sendThanks = function() {

        //First set up some JSON for the session token
        var payload = {
           "sessionToken" : sessionToken,
           "fromId" : $scope.sender.id,
           "message": $scope.thanksMessage
        }

        //Set our message for the loading spinner
        loadingSpinner.setMessage("/user/thanks", "Sending Thanks...");

        //Login the user, submit the payload to the backend
        Thanks.submit(payload,
        function(data, status) {

            //Success, save the response in scope
            $scope.thankResponse = data;

            //save a thanks cookies
            $cookies.put("thanks", true);

            //Finally redirect to the localism page
            $location.path("/localism");
        });
    }

    //Return an occasion icon
    $scope.getOccasion = function(Id) {
        return OccasionService.getOccasionsById(Id);
    }

    //Array of Occasion headings
	$scope.iconHeaders =
	[
		//Anniversary
		"Happy Anniversary!",
		//Baby
		"Congratulations on the Baby!",
		//Birthday
		"Happy Birthday!",
		//Congrats
		"Congratulations!",
		//Present (Custom Icon)
		"Enjoy Your Gift!",
		//Get Well Soon
		"Get Well Soon!",
		//Love
		"Love You!",
		//Sympathy
		"Feel Better Soon!",
		//Thank You
		"Thank You!",
		//Wedding
		"Congratulations on the Wedding!"
	]



    //Init
    $scope.getGiftcards();
    $scope.countCharacters();
    $scope.loading = true;

  });
