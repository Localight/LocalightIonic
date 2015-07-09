'use strict';

angular.module('giftcards').controller('TriconController', ['$scope', '$stateParams', '$location', '$cookieStore',
	function($scope, $stateParams, $location, $cookieStore) {

		//Switch overlay on
		document.getElementById('darkerOverlay').style.display = "block";

		//Our pressed tricon ***
		$scope.pressedTricon = "";

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

		//Shuffles an array using the Fisher-Yates algorithm
		$scope.shuffle = function(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex ;

		  // While there remain elements to shuffle...
		  while (0 !== currentIndex) {

		    // Pick a remaining element...
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;

		    // And swap it with the current element.
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }

		  return array;
		}

		//When tricon is being pressed, this function will be launched
		$scope.pressed = function(id){
			//Add tricon code here
			//console.log("Tricon Pressed: " + $scope.images[id]);
			//
			event.currentTarget.style.backgroundPositionY = '-100px';

			//And, add a star to pressed tricon
			$scope.pressedTricon = $scope.pressedTricon + "*";

			//Check if it has more than 2 characters, if it does, go to the confirmation page
			if($scope.pressedTricon.length > 2)
			{
				$location.path("/merchants/" + $scope.Id + "/confirmation")
			}
		}

		//When tricon is unpressed, this function will be launched
		$scope.unpressed = function(id){
			event.currentTarget.style.backgroundPositionY = '0px';
		}

		//Holds the table layout for the dynamic ng-repeat table
		$scope.tableLayout = [
				[0,1,2],
				[3,4,5],
				[6,7,8]
		];

		//Array of the eatery tricons and their paths
		$scope.images =
		[
			{name: "tricon-coffee", pos: "600"},
			{name: "tricon-cupcake", pos: "0"},
			{name: "tricon-dinner", pos: "300"},
			{name: "tricon-pie-slice", pos: "800"},
			{name: "tricon-sandwich", pos: "100"},
			{name: "tricon-shrimp", pos: "200"},
			{name: "tricon-soup", pos: "400"},
			{name: "tricon-sundae", pos: "700"},
			{name: "tricon-wine", pos: "500"}
		];

		//Shuffles the images array of tricons to always
		//display in different order
		$scope.images = $scope.shuffle($scope.images);

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


	}
]);
