'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:EnterAmountCtrl
 * @description
 * # EnterAmountCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('EnterAmountCtrl', function ($scope, $location, $routeParams, $cookies, Giftcards, rotationCheck, loadingSpinner) {

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

	//Get our merchant ID from the url
	$scope.Id = $routeParams.merchantId;

	//Initialize our giftcards in scope
	$scope.giftcards = null;

	//Variable if a dialpad button is clicked
	$scope.clicked = false;

	//Scope variable of the amount entered by the dialpad
	$scope.amount = parseInt(0).toFixed(2);

	//Entered Amount that is an unmodified int
	$scope.trueAmount = 0;

	//Our stack of digits entered by the user
	$scope.digitStack = [];

	//Our size of our stack (digitStack)
	$scope.stackSize = 0;

	//Our variable for which button is selected
	$scope.pressed = -1;

	//Boolean for if we should show a warning about the user reaching the max or total
	$scope.warning = false;
	$scope.totalWarning = false;

	//Holds the table layout for the dynamic ng-repeat table
	$scope.tableLayout = [
			[1,2,3],
			[4,5,6],
			[7,8,9]
	];

    //Tricon values
    $scope.tableValues = [
			[1,2,3],
			[4,5,6],
			[7,8,9]
	];

    // Find a list of Giftcards
	$scope.getGiftcards = function() {

        //Set our message for the loading spinner
        loadingSpinner.setMessage("/giftcards", "Getting Giftcards...");

        //First set up some JSON for the session token
        var payload = {
            "sessionToken" : sessionToken
        };

        //Query the backend using our session token
        Giftcards.get(payload,
        function(data, status) {

            ///Success save giftcards in scope
            $scope.giftcards = data;

            //Get the total value of all the Giftcards
            $scope.getTotalValue();
        });
	};

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
    };

	//Function to switch the value of pressed dialpad
	$scope.pressButton = function (i, event)
	{

		//Set clicked to true, so we know the dialpad is being pressed
		$scope.clicked = true;

        //Set the currently pressed dialpad button
		$scope.pressed = i;

		//Set Clicked button styling to the dialpad button
        var offset = '-100px';
        var backgroundX = event.currentTarget.style.backgroundPosition.slice(0,
            event.currentTarget.style.backgroundPosition.indexOf("px ") + 3);
        event.currentTarget.style.backgroundPosition = backgroundX + offset;

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
			//Push i onto the queue, Increase stack size,
			//Only if it is less than our max digits, 5
			//Push onto the stack, only if the button isnt zero
			//when the stack size is zero
			if(i != 0 || $scope.stackSize != 0)
			{
				$scope.digitStack.push(i);
				$scope.stackSize++;
			}

			//Init our final answer
			var answer = 0;

			//Create a temp stack we can peek
			var tempStack = $scope.digitStack.slice();

			//Loop to put in our places
			for(var j = $scope.stackSize; j > 0; --j)
			{
				//Get the value
				var pop = tempStack.pop();

				//Add it to the amount by multipling it by ten
				//By a certain power
				var add = pop * Math.pow(10, ($scope.stackSize - j));

				//Now add the amount to amount
				answer = answer + add;
			}

			//Get our total value
			var total = parseInt($scope.totalValue * 100);

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
			}
			else
			{
				//Nothing wrong, show!
				$scope.trueAmount = answer;
				$scope.amount = (parseInt(answer) / 100).toFixed(2);
			}
		}
        else {

			//Set button styling back to original
			event.currentTarget.style.backgroundPosition = backgroundX + "0px";
		}
	};

	//Function call when the back button non the dialpad is pressed
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
	};

	//Function to go back to selecting merchants
	$scope.goTo = function(place) {

		//Save our final amount if the path is to pay
		if(place == "/merchants/" + $scope.Id + "/tilt") {
			$cookies.put('igosdmbmtv', $scope.trueAmount);
            $location.path(place);
		}
        else if(place == "/merchants")
        {
            //Change locations to the merchants page, and include the location id
            $location.path("/merchants").search({merchant: $scope.Id});
        }
        else {
            $location.path(place);
        }
	};



    //Init
    $scope.getGiftcards();

});
