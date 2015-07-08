'use strict';

//giftcards service used to communicate Giftcards REST endpoints
angular.module('giftcards').factory('Giftcards', ['$resource',
	function($resource) {
		return $resource('/giftcards/:giftcardId',
		{ giftcardId: '@giftcardId' }, {
			getGiftcards: {
				method: 'GET',
				params: { giftcardId: "" }
			},
			getGiftcard: {
				method: 'GET',
				params: { giftcardId: "" }
			},
			createGiftcard: {
				method: 'POST',
				params: { giftcardId: "@giftcardId" }
			},
			spendGiftcard: {
				method: 'PUT',
				params: { giftcardId: "@giftcardId" }
			},
			deleteGiftcard: {
				method: 'DELETE',
				params: { giftcardId: "@giftcardId" }
			}
		});
	}
]);
