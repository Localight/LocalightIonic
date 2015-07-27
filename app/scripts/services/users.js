'use strict';

/**
 * @ngdoc service
 * @name angularLocalightApp.Users
 * @description
 * # Users
 * Service in the angularLocalightApp.
 */

 //Use http://localhost:3000/ for testing with nodemon
 angular.module('angularLocalightApp')
 .factory('Users', ['$resource', function($resource) {

 return $resource( 'http://localhost:3000/users',
     { }, {
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


     } );
 }]);

angular.module('angularLocalightApp')
.factory('Login', ['$resource', function($resource) {

return $resource( 'http://localhost:3000/users/login',
    { }, {
        submit: {
            method: 'POST',
            params: {},
            isArray: false
        }

    } );
}]);

angular.module('angularLocalightApp')
.factory('Join', ['$resource', function($resource) {

return $resource( 'http://localhost:3000/users/join',
    { }, {
        submit: {
            method: 'POST',
            params: {},
            isArray: false
        }

    } );
}]);
