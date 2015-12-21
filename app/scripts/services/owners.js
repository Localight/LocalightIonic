'use strict';

/**
 * @ngdoc service
 * @name localightApp.Owners
 * @description
 * # Owners
 * Service in the localightApp.
 */

 //Get an owner
angular.module('localightApp')
  .factory('Owners', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/owners', {}, {
      get: {
        method: 'GET',
        params: {},
        isArray: false
    },
        update: {
          method: 'PUT',
          params: {},
          isArray: false
      }


    });
  }]);

// Sign up an owner to the app
angular.module('localightApp')
  .factory('JoinOwner', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/owners/join', {}, {
      submit: {
        method: 'POST',
        params: {},
        isArray: false
      }

    });
  }]);

//Login an owner
angular.module('localightApp')
  .factory('LoginOwner', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/owners/login', {}, {
      submit: {
        method: 'POST',
        params: {},
        isArray: false
      }

    });
  }]);
