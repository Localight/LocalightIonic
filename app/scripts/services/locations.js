'use strict';

/**
 * @ngdoc service
 * @name localightApp.locations
 * @description
 * # locations
 * Service in the localightApp.
 */

//Get all the giftcards, or create one
angular.module('localightApp')
  .service('Locations', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/locations', {}, {
      create: {
        method: 'POST',
        params: {},
        isArray: false
      },
      get: {
        method: 'GET',
        params: {},
        isArray: true
      }
    });
  }]);

//Get a location by it's ID
angular.module('localightApp')
  .factory('LocationById', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/locations/:id', {
        id: '@id'
    },
    {

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


  //Get all of the locations under an owner
  angular.module('localightApp')
    .factory('LocationByOwner', ['$resource', 'ENV', function($resource, ENV) {

      return $resource(ENV.API_BASE + '/locations/owner/:id', {
          id: '@id'
      }, {
        get: {
          method: 'GET',
          params: {},
          isArray: true
        }

      });
    }]);


//Get a Location by it's location code
angular.module('localightApp')
  .factory('LocationByCode', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/locations/code', {}, {
      get: {
        method: 'GET',
        params: {},
        isArray: false
      }

    });
  }]);


//Spend a giftcard at a location
angular.module('localightApp')
  .factory('Spend', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/locations/:id/spend', {
      id: '@id'
    }, {
      spendGiftcard: {
        method: 'POST',
        params: {},
        isArray: false
      }

    });
  }]);
