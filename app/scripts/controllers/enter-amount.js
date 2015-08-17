'use strict';

/**
 * @ngdoc function
 * @name angularLocalightApp.controller:EnterAmountCtrl
 * @description
 * # EnterAmountCtrl
 * Controller of the angularLocalightApp
 */
angular.module('angularLocalightApp')
  .controller('EnterAmountCtrl', function ($scope, $location, $routeParams, $cookies, Giftcards, $window) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Boolean for alert
    $scope.rotateAlert = false;

    //Check for device orientation
    $window.addEventListener("orientationchange", function() {
        if(!$scope.rotateAlert && ($window.orientation == -90 || $window.orientation == 90))
        {
            $scope.rotateAlert = true;
            alert("Please disable device rotation, this application is meant to be used in portrait mode. You could risk spending a giftcard incorrectly, or losing your data.");
        }
    }, false);

        //Switch overlay on
		document.getElementById('darkerOverlay').style.display = "block";
        document.body.style.backgroundColor = "#316D6B";

        //get our session token from the cookies
        $scope.sessionToken = $cookies.get("sessionToken");

		//Get our merchant ID
		$scope.Id = $routeParams.merchantId;

		//Initialize scope.giftcards
		$scope.giftcards = null;

		//Variable if a button is clicked
		$scope.clicked = false;

		//Amoutn entered
		$scope.amount = parseInt(0).toFixed(2);

		//Amount that is an unmodified int
		$scope.trueAmount = 0;

		//Our stack of digits entered
		$scope.digitStack = [];

		//Our size of our stack
		$scope.stackSize = 0;

		//Our variable for which button is selected
		$scope.pressed = -1;

		//Boolean for if we should show a warning about max
		//Or total value
		$scope.warning = false;
		$scope.totalWarning = false;

		//Holds the table layout for the dynamic ng-repeat table
		$scope.tableLayout = [
				[1,2,3],
				[4,5,6],
				[7,8,9]
		];

        // Find a list of Giftcards from the DB
        $scope.getGiftcards = function() {
            //Get our giftcards from the user
            //First set up some JSON for the session token
            var getJson = {
                "sessionToken" : $scope.sessionToken
            }

            //Query the backend using out session token
            $scope.giftcards = Giftcards.get(getJson, function()
            {
                //Check for errors
                if($scope.giftcards.errorid)
                {
                    console.log($scope.giftcards.errorid + ": " + $scope.giftcards.msg);
                    return;
                }
                else {
                    //there was no error continue as normal
                    //Stop any loading bars or things here
                }
            });
        }

		$scope.totalValue = function()
		{
			//Get the total value of all the giftcards
			var total = 0;
			for(var i = 0; i < $scope.giftcards.length; ++i)
			{
				total = total + parseInt($scope.giftcards[i].amount, 10);
			}

			//Return the total value as a formatted string
			return (parseInt(total) / 100).toFixed(2);
		}

		//Function to switch the value of pressed
		$scope.pressButton = function (i)
		{
			//Clicked is now true
			$scope.clicked = true;

			$scope.pressed = i;

			//Set clicked button styling
			event.currentTarget.style.backgroundPositionY = '-100px';

			//Ignore values that are negative one, since thye simply disable our selectors
			//Also checking for the number of digits
			//Using / 100 to keep everything in ints
			//Also, do not allow zero to be press if no trailing non zero in the stack
			if(i != -1)
			{
				//Remove the warnings if there are somehow
				if($scope.warning == true || $scope.totalWarning == true)
				{
					$scope.warning = false;
					$scope.totalWarning = false;
				}

				//Add to our amount from right to left, so just concatanate to the string
				//push i onto the queue
				//Increase stack size,
				//only if it is less than our max digits, 5
				//Push onto the stack, only if the button isnt zero
				//when the stack size is zero
				if(i != 0 || $scope.stackSize != 0)
				{
					$scope.digitStack.push(i);
					$scope.stackSize++;
				}

				//Our final answer
				var answer = 0;

				//create a temp stack we can peek
				var tempStack = $scope.digitStack.slice();

				//Loop to put in our places
				for(var j = $scope.stackSize; j > 0; --j)
				{
					//Get the value
					var pop = tempStack.pop();

					//add it to the amount by multipling it by ten
					//by a certain power
					var add = pop * Math.pow(10, ($scope.stackSize - j));

					//Now add the amount to amount
					answer = answer + add;
				}

				//Get our total value
				var total = parseInt($scope.totalValue() * 100);
				//Also, check if the amount is greater than our maxes
				if(answer > total)
				{
					//Only show one warning at a time
					if($scope.warning)
					{
						$scope.warning = false;
					}
					$scope.totalWarning = true;

					//Make the amount total value
					$scope.trueAmount = 0;
					$scope.amount = (parseInt(0) / 100).toFixed(2);

					//Make the stack the empty
					$scope.digitStack = [];
					$scope.stackSize = 0;

					//Just going to make it empty, to avoid user confusion
					// var totalString = (total).toString();
					//
					// for(i = 0; i < totalString.length; ++i)
					// {
					// 	$scope.digitStack.push(totalString[i]);
					// }

				}
				else if(answer / 100 > 500)
				{
					//Only show one warning at a time
					if($scope.totalWarning)
					{
						$scope.totalWarning = false;
					}
					$scope.warning = true;

					//Make the amount 0
					$scope.trueAmount = 0;
					$scope.amount = (parseInt(0) / 100).toFixed(2);

					//Make the stack empty
					$scope.digitStack = [];
					$scope.stackSize = 0;


					//Just going to make it empty, to avoid user confusion
					// // $scope.digitStack.push(5);
					// // $scope.digitStack.push(0);
					// // $scope.digitStack.push(0);
					// // $scope.digitStack.push(0);
					// // $scope.digitStack.push(0);
					//
					// //Check if our stack is too large
					// while($scope.stackSize > 5)
					// {
					// 	$scope.digitStack.pop;
					// 	$scope.stackSize--;
					// }
				}
				else
				{
					//Nothing wrong, show!
					$scope.trueAmount = answer;
					$scope.amount = (parseInt(answer) / 100).toFixed(2);
				}
			} else {
				//Set button styling back to original
				event.currentTarget.style.backgroundPositionY = '0px';
			}
		}

		//function call when the back button is pressed
		$scope.backSpace = function()
		{
			//Pop from our stack, and decrease our stack size
			if($scope.stackSize > 0)
			{
				$scope.digitStack.pop();
				$scope.stackSize--;
			}

			//Our final answer
			var answer = 0;

			//create a temp stack we can peek
			var tempStack = $scope.digitStack.slice();

			//Loop to put in our places
			for(var i = $scope.stackSize; i > 0; --i)
			{
				//Get the value
				var pop = tempStack.pop();

				//add it to the amount by multipling it by ten
				//by a certain power
				var add = pop * Math.pow(10, ($scope.stackSize - i));

				//Now add the amount to amount
				answer = answer + add;
			}

			//Nothing wrong, show!
			$scope.amount = parseInt(answer) / 100;
		}

		//Function to go back to selecting merchants
		$scope.goTo = function(place) {
			//Save our final amount if the path is to pay
			if(place == "/merchants/" + $scope.Id + "/tilt") {
				$cookies.put('igosdmbmtv', $scope.trueAmount);
			}

			$location.path(place);
		}

  });
