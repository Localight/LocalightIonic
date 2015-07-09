'use strict';

angular.module('giftcards').controller('ThankYouController', ['$scope', '$stateParams', '$cookieStore', '$location',
	function($scope, $stateParams, $cookieStore, $location) {

		//Switch overlay off
      	document.getElementById('darkerOverlay').style.display = "none";

		//Initialize scope.giftcards
		$scope.giftcards = null;

		//Our character count for the text area
		$scope.charCount;

		//Total purcahse value
		$scope.purchaseValue;

		//Retrive the cookie with our amount
		var amount = $cookieStore.get("igosdmbmtv");
		if(!amount)
		{
			amount = 0;
		}
		$cookieStore.remove("igosdmbmtv");
		$scope.purchaseValue = (parseInt(amount) / 100).toFixed(2);


		//Prepare our text area
		$scope.setTextArea = function ()
		{
			//Set the default value of our text area
			document.getElementById("thankYouNote").value = $scope.giftcards[0].from + ", I used the Local Giftcard at "
			+ $scope.merchants[$scope.Id].name + " to get...";
		}

		//Count our text area characters
		$scope.countCharacters = function()
		{
			$scope.charCount = 160 - document.getElementById("thankYouNote").value.length;
		}

		//Get our merchant ID
		$scope.Id = $stateParams.merchantId;

		//Our merchants
		$scope.merchants = [{
			area: "4th Street Retro Row",
			name: "Goldies On 4th",
			id: 0,
			address: "2106 E 4th St, Long Beach, CA"
		},{
			area: "4th Street Retro Row",
			name: "Aji Peruvian Cuisine",
			id: 1,
			address: "2308 E 4th St, Long Beach, CA"
		},{
			area: "4th Street Retro Row",
			name: "P3 Artisan Pizza",
			id: 2,
			address: "2306 E 4th St, Long Beach, CA"
		},{
			area: "4th Street Retro Row",
			name: "The Social List",
			id: 3,
			address: "2105 E 4th St, Long Beach, CA"
		},{
			area: "4th Street Retro Row",
			name: "Lola's",
			id: 4,
			address: "2030 E 4th St, Long Beach, CA"
		},{
			area: "4th Street Retro Row",
			name: "Portfolio's Coffee",
			id: 5,
			address: "2300 E 4th St, Long Beach, CA"
		}]

		// Find a list of Giftcards
		$scope.getGiftcards = function() {
			//$scope.giftcards = Giftcards.query();

			//FOr testing, hardcoding scope giftcards
			$scope.giftcards =
			[
				{
					_id: "1",
					to: "John",
					amt: "10000",
					mobileNumberOfRecipient: "5625555555",
					merchant: "xxxxx",
					from: 'Tony',
					message: "hi",
					districtNumber: 'number',
					occasionMessage: "Variety is the spice of life. So I'm giving you the gift of choice!",
					occasionHeading: "Happy Birthday!",
					occasionNumber: "2"
				},
				{
					_id: "2",
					to: "John",
					amt: "10000",
					mobileNumberOfRecipient: "5625555555",
					merchant: "xxxxx",
					from: 'Frank',
					message: "hi",
					districtNumber: 'number',
					occasionMessage: "Congratulations on your baby!",
					occasionHeader: "Get Well Soon!",
					occasionNumber: "5"
				}
			]
			var giftcard;
			for (giftcard in $scope.giftcards){
				if($scope.giftcards[giftcard]._id == $stateParams.giftcardId){
					$scope.giftcard = $scope.giftcards[giftcard];
					break;
				}
			}
		}

		$scope.totalValue = function()
		{
			//Get the total value of all the giftcards
			var total = 0;
			for(var i = 0; i < $scope.giftcards.length; ++i)
			{
				total = total + parseInt($scope.giftcards[i].amt, 10);
			}

			//Return the total value as a formatted string
			return (parseInt(total) / 100).toFixed(2);
		}

		//Function to go back to selecting merchants
		$scope.goTo = function(place) {
			//Send the user to another page!

			$location.path(place);
		}

		//Array of occasion Icons, simply a link to their icon
		$scope.icons =
		[
			//Anniversary
			"/modules/giftcards/img/occasion-anniversary-icon-wht.png",
			//Baby
			"/modules/giftcards/img/occasion-baby-icon-wht.png",
			//Birthday
			"/modules/giftcards/img/occasion-birthday-icon-wht.png",
			//Congrats
			"/modules/giftcards/img/occasion-congrats-icon-wht.png",
			//Present (Custom Icon)
			"/modules/giftcards/img/occasion-custom-icon-wht.png",
			//Get Well Soon
			"/modules/giftcards/img/occasion-getwell-icon-wht.png",
			//Love
			"/modules/giftcards/img/occasion-love-icon-wht.png",
			//Sympathy
			"/modules/giftcards/img/occasion-sympathy-icon-wht.png",
			//Thank You
			"/modules/giftcards/img/occasion-thankyou-icon-wht.png",
			//Wedding
			"/modules/giftcards/img/occasion-wedding-icon-wht.png"
		]

	}
]);
