'use strict';

angular.module('giftcards').controller('ConfirmationPageController', ['$scope', '$timeout', '$location', '$stateParams', '$cookieStore',
	function($scope, $timeout, $location, $stateParams, $cookieStore) {

		//Switch overlay on
		document.getElementById('darkerOverlay').style.display = "block";

		//Timeout to the next page
		$timeout(timeoutRedirect, 2000);

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

		//Get the amount we are going to send the server
		$scope.getAmount = function()
		{
			//Retrive the cookie with our amount
			var amount = $cookieStore.get("igosdmbmtv");
			if(!amount)
			{
				$scope.goTo("/merchants/" + $scope.Id + "/amount");
			}
			return (parseInt(amount) / 100).toFixed(2);
		}

		//Get the merchant we are going to send the server
		$scope.getMerchant = function()
		{
			//Replace this with a backend call eventually
			return "Doly's Delectables";
		}

		//Redirect to the thank you page
		function timeoutRedirect()
		{
    		$location.path("/merchants/" + $scope.Id + "/thankyou");
		}
	}
]);
