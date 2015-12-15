'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:MainpanelCtrl
 * @description
 * # MainpanelCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('MainpanelCtrl', function ($scope, $cookies, $location, Owners, LocationByOwner, loadingSpinner) {

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //Grab our session token from the cookies
    var sessionToken = $cookies.get("sessionToken");

    //Get our owner info on page load
    $scope.getOwner = function() {

        //First set up some JSON for the session token
        var payload = {
           "sessionToken" : sessionToken
        }

        //Set our message for the loading spinner
        loadingSpinner.setMessage("/owners", "Getting Owner Info...");

        Owners.get(payload,
        function(data, status){

            //Success, save the data to scope
            $scope.owner = data;

            //Check if they have completed their additionalinfo
            if(!$scope.owner.dob)
            {
                //Redirect to the additionalinfo page
                $location.path("/dashboard/additionalinfo");
            }
            else {
                //Get the locations
                $scope.getLocations();
            }
        });

    }

    //get the locations from the backend
    $scope.getLocations = function() {

        //Json to send to the backend
        var payload = {
            "id" : $scope.owner._id
        }

        //Set our message for the loading spinner
        loadingSpinner.setMessage("/locations/owner/" + $scope.owner._id, "Getting Locations...");

        LocationByOwner.get(payload,
        function(data, status) {

            //Success, save the data from the backend in scope
            $scope.locations = data;
        });
    }

    //Array of the eatery tricons and their paths
    $scope.images =
    [
        {name: "tricon-coffee", pos: "600", code: "e107"},
        {name: "tricon-cupcake", pos: "0", code: "e101"},
        {name: "tricon-dinner", pos: "300", code: "e104"},
        {name: "tricon-pie", pos: "800", code: "e109"},
        {name: "tricon-sandwich", pos: "100", code: "e102"},
        {name: "tricon-sushi", pos: "200", code: "e103"},
        {name: "tricon-pho-soup", pos: "400", code: "e105"},
        {name: "tricon-sundae", pos: "700", code: "e108"},
        {name: "tricon-wine", pos: "500", code: "e106"}
    ];

    //function to return the corresponding image positions
    $scope.getTricons = function(triconCode) {

        //Create our tricon position array
        var triconArray = [];
        //Get the values of the corresponding codes
        for(var i = 0; i < 3; i++)
        {
            //Search for the code
            for(var j = 0; j < $scope.images.length; j++)
            {
                //Check if the substring matches the code
                var codeIndex = i * 4;
                if(triconCode.substring(codeIndex, codeIndex + 4)
                == $scope.images[j].code)
                {
                    //Set the value of the tricon array and break from the j loop
                    triconArray[i] = $scope.images[j].pos;
                    break;
                }
            }
        }

        //Return the tricon array!
        return triconArray;
    }

    //create a location
    $scope.redirectCreate = function() {
        //redirect to the create a location page
        $location.path("/dashboard/createlocation");
    }

    //Init
    $scope.getOwner();

  });
