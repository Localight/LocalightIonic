'use strict';

angular.module('giftcards').controller('SelectMerchantController', ['$scope', '$window',
	function($scope, $window) {

		//Switch overlay off
		document.getElementById('darkerOverlay').style.display = "none";

		//Initialize scope.giftcards
		$scope.giftcards = null;


		$scope.merchants = [{
			_id: "1",
			area: "4th Street Retro Row",
			name: "Goldies On 4th",
			address: "2106 E 4th St, Long Beach, CA"
		},{
			_id: "2",
			area: "4th Street Retro Row",
			name: "Aji Peruvian Cuisine",
			address: "2308 E 4th St, Long Beach, CA"
		},{
			_id: "3",
			area: "4th Street Retro Row",
			name: "P3 Artisan Pizza",
			address: "2306 E 4th St, Long Beach, CA"
		},{
			_id: "4",
			area: "4th Street Retro Row",
			name: "The Social List",
			address: "2105 E 4th St, Long Beach, CA"
		},{
			_id: "5",
			area: "4th Street Retro Row",
			name: "Lola's",
			address: "2030 E 4th St, Long Beach, CA"
		},{
			_id: "6",
			area: "4th Street Retro Row",
			name: "Portfolio's Coffee",
			address: "2300 E 4th St, Long Beach, CA"
		}]


		// Find a list of Giftcards
		$scope.find = function() {
			//$scope.giftcards = Giftcards.query();

			//FOr testing, hardcoding scope giftcards
			$scope.giftcards =
			[
				{
					to: "John",
					amt: "100",
					mobileNumberOfRecipient: "5625555555",
					merchant: "xxxxx",
					from: 'Tony',
					message: "hi",
					districtNumber: 'number',
					occasionMessage: "Variety is the spice of life. So I'm giving you the gift of choice!"
				},
				{
					to: "John",
					amt: "100",
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
			return "$" + total;
		}
	}
]);
