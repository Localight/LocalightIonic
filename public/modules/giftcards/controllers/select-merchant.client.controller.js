'use strict';

angular.module('giftcards').controller('SelectMerchantController', ['$scope', '$window',
	function($scope, $window) {

		//Switch overlay off
		document.getElementById('darkerOverlay').style.display = "none";

		//Initialize scope.giftcards
		$scope.giftcards = null;


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
					to: "John",
					amt: "10000",
					mobileNumberOfRecipient: "5625555555",
					merchant: "xxxxx",
					from: 'Tony',
					message: "hi",
					districtNumber: 'number',
					occasionMessage: "Variety is the spice of life. So I'm giving you the gift of choice!"
				},
				{
					to: "John",
					amt: "10000",
					mobileNumberOfRecipient: "5625555555",
					merchant: "xxxxx",
					from: 'Frank',
					message: "hi",
					districtNumber: 'number'
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
	}
]);
