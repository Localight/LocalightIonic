'use strict';

/**
 * @ngdoc function
 * @name angularLocalightApp.controller:ThankyouCtrl
 * @description
 * # ThankyouCtrl
 * Controller of the angularLocalightApp
 */
angular.module('angularLocalightApp')
  .controller('ThankyouCtrl', function ($scope, $routeParams, $cookies, $location, $window, rotationCheck, Giftcards, LocationById, Thanks, loadingSpinner) {

      //Initialize the loading service
      $scope.loadHandler = loadingSpinner.loading;
      $scope.errorHandler = loadingSpinner.error;

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

        //Start loading
        var loadRequest = loadingSpinner.load("Getting Location...");

        //First set up some JSON for the session token
        var payload = {
            "id" : $scope.Id,
            "sessionToken" : sessionToken
        }

        //Send the payload to the backend
        LocationById.get(payload,
            function(data, status) {

            //Success! Save the response to our scope!
            $scope.merchantLocation = data;

            //Initialize our thanks message
            $scope.thanksMessage = $scope.sender.name +
            " I used the Local Giftcard at " + $scope.merchantLocation.name +
            " to get ..."


            //Stop Loading
            loadingSpinner.stopLoading(loadRequest);

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

	//Function to go back to a page passed in params
	$scope.goTo = function(place) {
		$location.path(place);
	}

    //Send the thank you
    $scope.sendThanks = function() {

        //Start loading
        var loadRequest = loadingSpinner.load("Getting Giftcards...");

        //First set up some JSON for the session token
        var payload = {
           "sessionToken" : sessionToken,
           "fromId" : $scope.sender.id,
           "message": $scope.thanksMessage
        }

        //Login the user, submit the payload to the backend
        Thanks.submit(payload,
        function(data, status) {

            //Stop Loading
            loadingSpinner.stopLoading(loadRequest);

            //Success, save the response in scope
            $scope.thankResponse = data;

            //Finally redirect to the localism page
            $location.path("/localism");
        },
        function(err) {

            //Stop Loading
            loadingSpinner.stopLoading(loadRequest);

            //Create the error object
            $scope.error = {
                isError : true,
                text: ""
            };

            if(err.status == 401)
            {
                $scope.error.text = "Sorry, the entered account information is incorrect.";
            }
            else {
                $scope.error.text = "Sorry, an error has occured connecting to the database";
            }
        });
    }

	//Array of occasion Icons, simply a link to their icon
	$scope.icons =
	[
		//Anniversary
		"../images/occasion-anniversary-icon-wht.png",
		//Baby
		"../images/occasion-baby-icon-wht.png",
		//Birthday
		"../images/occasion-birthday-icon-wht.png",
		//Congrats
		"../images/occasion-congrats-icon-wht.png",
		//Present (Custom Icon)
		"../images/occasion-custom-icon-wht.png",
		//Get Well Soon
		"../images/occasion-getwell-icon-wht.png",
		//Love
		"../images/occasion-love-icon-wht.png",
		//Sympathy
		"../images/occasion-sympathy-icon-wht.png",
		//Thank You
		"../images/occasion-thankyou-icon-wht.png",
		//Wedding
		"../images/occasion-wedding-icon-wht.png"
	]

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
  });
