'use strict';

angular.module('giftcards').controller('ListGiftCardsController', ['$scope',
	function($scope) {

		//Switch overlay off
		document.getElementById('darkerOverlay').style.display = "none";

		//Initialize scope.giftcards
		$scope.giftcards = null;

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
					occasionNumber: "5"
				}
			]
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

		//function to fomat a giftcard value for us
		$scope.giftValue = function(amt)
		{
			//Return the total value as a formatted string
			return (parseInt(amt) / 100).toFixed(2);
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
