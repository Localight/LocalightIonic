'use strict';

//giftcards service used to communicate Giftcards REST endpoints
angular.module('giftcards').factory('Giftcards', ['$resource',
	function($resource) {
		return $resource('giftcards/:giftcardId', { giftcardId: '@_id'
		}, {
			
		});
	}
]);
