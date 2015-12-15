'use strict';

/**
 * @ngdoc directive
 * @name localightApp.directive:loadingSpinner
 * @description
 * # loadingSpinner
 */
angular.module('localightApp')
  .directive('loadingSpinner', function () {
    return {
      replace: false,
      restrict: 'E',
      templateUrl: 'views/loadingSpinner.html',
      controller: function ($scope, loadingSpinner) {

          //Initialize the loading service
          $scope.spinner = loadingSpinner.init();


      }
    };
  });
