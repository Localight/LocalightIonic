'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:CreatelocationCtrl
 * @description
 * # CreatelocationCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('CreatelocationCtrl', function ($scope, $cookies, $location, $route, Owners, Locations, loadingSpinner) {

    //get our session token from the cookies
    var sessionToken = $cookies.get("sessionToken");

    //Duplicate form scope
    $scope.theForm = {};
    $scope.formData = {};

    //Switch the view from the first and second "page" of the process
    $scope.switchPage = function() {
        //Set the body background to dark
        document.body.className = "darkBlurBodyBg";

        //Scroll back to the top
        window.scrollTo(0, 0);

        //Duplicate form scope
        $scope.formData = $scope.theForm;

        //Set show the next page to true
        $scope.showNextPage = true;
    }

    //Set the background class back if going to a new url
    $scope.$on('$locationChangeStart', function(next, current) {
        document.body.className = "";
    });

    /*--------------------------------
    *
    *   SECOND PAGE LOGIC
    *
    --------------------------------*/

    //Our tricon message that is displayed to the user
    $scope.triconMessage = "Please enter a 3 item tricon code. This will be used by employees for confirmation to use a giftcard at your location.";

    //Array of entered tricons
    $scope.triconArray = [];

    //Boolean to show if the tricon ahs been confirmed
    $scope.confirmedCode = false;

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

    //Function to respond to tricon presses
    $scope.pressed = function(id, event){

        //Reset the error message
        $scope.errorMsg = "";

        //Set Clicked button styling to the tricon button
        var offset = '-100px';
        var backgroundX = event.currentTarget.style.backgroundPosition.slice(0,
            event.currentTarget.style.backgroundPosition.indexOf("px ") + 3);
        event.currentTarget.style.backgroundPosition = backgroundX + offset;

        //Check if they had already entered a code
        if($scope.triconArray.length > 2) {

            //Reset the message, array, and confirmation for the user
            $scope.triconMessage = "Please enter a 3 item tricon code. This will be used by employees for confirmation to use a giftcard at your location.";
            $scope.triconArray = [];
            $scope.confirmedCode = false;
        }

        //Push the tricon onto the array
        $scope.triconArray.push($scope.images[id]);

        //Check if it has more than 2 images, if it does, go to the confirmation page
        if($scope.triconArray.length > 2) {

            //Inform the user that it is good, and confirmed!
            $scope.triconMessage = "Please submit the entered code to finish creating your location"
            $scope.confirmedCode = true;
        }
    }

    //function to deleted from the tricon array
    $scope.deleteTricon = function() {
        //Simply pop from the stack
        if($scope.triconArray.length > 0) $scope.triconArray.pop();
    }

    //Handle when a tricon becomes unpressed
    $scope.unpressed = function(id, event) {

        var backgroundX = event.currentTarget.style.backgroundPosition.slice(0,
            event.currentTarget.style.backgroundPosition.indexOf("px ") + 3);
        event.currentTarget.style.backgroundPosition = backgroundX + "0px";
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

    //Shuffles the images array of tricons to always
    //display in different order
    $scope.images = $scope.shuffle($scope.images);

    //Create the location
    $scope.submitLocation = function() {

        //First set up some JSON for the session token
        var payload = {
           "sessionToken" : sessionToken,
           "name" : $scope.formData.locationName,
           "triconKey" : $scope.triconArray[0].code + "" + $scope.triconArray[1].code + "" + $scope.triconArray[2].code,
           "address1" : $scope.formData.address1,
           "address2" : $scope.formData.address2,
           "city" : $scope.formData.city,
           "state" : $scope.formData.state,
           "zipcode" : $scope.formData.zipcode
       };

       //Set our message for the loading spinner
       loadingSpinner.setMessage("/locations", "Creating Location...", true);

        //Send the payload to the backend
        Locations.create(payload,
            function(data, status) {

                //Success, redirect back to the main page, add data to scope
                $scope.newLocation = data;
                $location.path("/dashboard/main");
            },
            function(err) {

                //Create the error object
                $scope.error = {
                    isError : true,
                    text: ""
                };

                //Error, Inform the user of the status
                if (err.status == 401) {
                   //Session is invalid! Redirect to 404
                   $scope.error.text = "Sorry, the entered account information is incorrect.";
                } else {
                   //An unexpected error has occured, inform user, log into console
                   console.log("Status: " + err.status + " " + err.data.msg);
                   $scope.error.text = "Sorry, an error has occured connecting to the database";
                }
            });
    }

  });
