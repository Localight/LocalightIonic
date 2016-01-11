'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:BodybgCtrl
 * @description
 * # BodybgCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('BodyCtrl', function ($scope, $location, $timeout) {

    //Our backGround tag
    var html = document.documentElement;
    var backGround = document.getElementById("localCity");

    //If the route is the route passed,
    //it will switch the body ng-class
    $scope.isDark = function(route) {
      return ($location.path().indexOf(route) > -1);
    }

    //Redirect function for invalid devices
    var invalidDevice = function(){
        //No Longer Rick Rolling, but we should deter desktop users
        //window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }

    //Check if this is not a mobile device
    if (navigator.maxTouchPoints <= 1 || navigator.plugins.length > 0) {
      invalidDevice();
    } else if (window.chrome) {
      if (window.chrome.webstore) {
          invalidDevice();
      }
    };

    //Set the position of the background to be the device height
    //We want only a fraction of the screen height of blue space so use that for our y position
    //Using availHeight since it will return the height after ui bars hide
    backGround.style.backgroundPosition = "100% " + (window.screen.availHeight * .3485) + "px";

    $timeout(function(){
        backGround.className = backGround.className + " bgFade";
    }, 100);
  });
