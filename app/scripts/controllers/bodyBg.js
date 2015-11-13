'use strict';

/**
 * @ngdoc function
 * @name angularLocalightApp.controller:BodybgCtrl
 * @description
 * # BodybgCtrl
 * Controller of the angularLocalightApp
 */
angular.module('angularLocalightApp')
  .controller('BodyCtrl', function ($scope, $location, $timeout) {

    //If the route is the route passed,
    //it will switch the body ng-class
    $scope.isDark = function(route) {
      return ($location.path().indexOf(route) > -1);
    }

    // var invalidDevice = function(){
    //     window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    // }
    //
    // if (navigator.maxTouchPoints <= 1 || navigator.plugins.length > 0) {
    //   invalidDevice();
    // } else if (window.chrome) {
    //   if (window.chrome.webstore) {
    //     invalidDevice();
    //   }
    // };

    $timeout(function(){
        var html = document.getElementsByTagName("html");
        html[0].className = html[0].className + " bgFade";
    }, 100);
  });
