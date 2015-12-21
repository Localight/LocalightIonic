'use strict';

/**
 * @ngdoc function
 * @name localightApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the localightApp
 */
angular.module('localightApp')
  .controller('MainCtrl', function ($scope, rotationCheck) {
      //Reset the rotation alert boolean
      rotationCheck.reset();
  });
