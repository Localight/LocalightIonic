'use strict';

/**
 * @ngdoc service
 * @name localightApp.giftcards
 * @description
 * # giftcards
 * Service in the localightApp.
 */

//Create a giftcard, or return all of a user's giftcards
angular.module('localightApp')
  .service('Giftcards', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/giftcards', {}, {
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

//Get a giftcard by it's ID
angular.module('localightApp')
  .factory('GiftcardById', ['$resource', 'ENV', function($resource, ENV) {

    return $resource(ENV.API_BASE + '/giftcards/:id', {}, {
      get: {
        method: 'GET',
        params: {},
        isArray: false
      }

    });
  }]);

//Get the giftcards sent by a user
angular.module('localightApp')
.factory('GivenGifts', ['$resource', 'ENV', function($resource, ENV) {

  return $resource(ENV.API_BASE + '/giftcards/given', {}, {
    get: {
      method: 'GET',
      params: {},
      isArray: true
    }

  });
}]);
