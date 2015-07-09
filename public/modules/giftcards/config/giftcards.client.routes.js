'use strict';

//Setting up route
angular.module('giftcards').config(['$stateProvider',
	function($stateProvider) {
		// Giftcards state routing
		$stateProvider.
		state('confirmation-page', {
			url: '/merchants/:merchantId/confirmation',
			templateUrl: 'modules/giftcards/views/confirmation-page.client.view.html'
		}).
		state('thank-you', {
			url: '/merchants/:merchantId/thankyou',
			templateUrl: 'modules/giftcards/views/thank-you.client.view.html'
		}).
		state('tricon', {
			url: '/merchants/:merchantId/tricon',
			templateUrl: 'modules/giftcards/views/tricon.client.view.html'
		}).
		state('tilt-screen', {
			url: '/merchants/:merchantId/tilt',
			templateUrl: 'modules/giftcards/views/tilt-screen.client.view.html'
		}).
		state('selectMerchant', {
			url: '/merchants',
			templateUrl: 'modules/giftcards/views/select-merchant.client.view.html'
		}).
		state('listGiftcards', {
			controller: 'ListGiftCardsController',
			url: '/giftcards',
			templateUrl: 'modules/giftcards/views/list-giftcards.client.view.html'
		}).
		state('createGiftcard', {
			url: '/giftcards/create',
			templateUrl: 'modules/giftcards/views/purchaseSequence/create_giftcard_order.client.view.html'
		}).
		state('viewGiftcard', {
			url: '/giftcards/:giftcardId',
			templateUrl: 'modules/giftcards/views/spendingSequence/recipient.html'
		}).
		state('spendGiftcard', {
			url: '/merchants/:merchantId/amount',
			templateUrl: 'modules/giftcards/views/spendingSequence/spend.html'
		}).
		state('editGiftcard', {
			url: '/giftcards/:giftcardId/edit',
			templateUrl: 'modules/giftcards/views/edit-giftcard.client.view.html'
		});
		// state('reviewGiftcard', {
		// 	url: '/review',
		// 	templateUrl: 'modules/giftcards/views/purchaseSequence/review_giftcard_order.client.view.html'
		// })
		// .state('sendGiftcard', {
		// 	url: '/sent',
		// 	templateUrl: 'modules/giftcards/views/purchaseSequence/giftcard_sent.client.view.html'
		// });
	}
]);
