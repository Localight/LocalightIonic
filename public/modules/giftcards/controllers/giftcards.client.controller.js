'use strict';
// Giftcards controller
angular.module('giftcards')
  .controller('GiftcardsController', ['$scope', '$http', '$stateParams', '$location', 'Authentication', 'Giftcards', 'processPaymentService', '$log', '$q',
    'OccasionService',
    function($scope, $http, $stateParams, $location, Authentication, Giftcards, processPaymentService, $log, $q, OccasionService) {
      $scope.authentication = Authentication;

      $scope.gc = new Giftcards();

      $scope.prices = [2, 5, 10, 25, 50, 75, 100];
      // flag to show other section.
      $scope.setShowPage = function() {
        $scope.showPageFlag = false;
      };

      //Flags for various things.
      // Border Flags
      $scope.showBackgroundFlag = false;
      $scope.showBackgroundFlagTwo = false;
      $scope.showBackgroundFlagThree = false;
      $scope.showBackgroundFlagFour = false;

      $scope.priceSelectionFlag = true;
      $scope.showPageFlag = true;

      $scope.flipCardFlag = false;

      $scope.flipCard = function() {
        $scope.flipCardFlag = false;
      };
      $scope.setBorderFlagOne = function() {
        $scope.showBackgroundFlag = true;
        $scope.showBackgroundFlagTwo = false;
        $scope.showBackgroundFlagThree = false;
        $scope.showBackgroundFlagFour = false;
      };

      $scope.setBorderFlagTwo = function() {
        $scope.showBackgroundFlag = false;
        $scope.showBackgroundFlagTwo = true;
        $scope.showBackgroundFlagThree = false;
        $scope.showBackgroundFlagFour = false;
      };
      $scope.setBorderFlagThree = function() {
        $scope.showBackgroundFlag = false;
        $scope.showBackgroundFlagTwo = false;
        $scope.showBackgroundFlagThree = true;
        $scope.showBackgroundFlagFour = false;
      };
      $scope.setBorderFlagFour = function() {
        $scope.showBackgroundFlagTwo = false;
        $scope.showBackgroundFlag = false;
        $scope.showBackgroundFlagThree = false;
        $scope.showBackgroundFlagFour = true;
      };

      $scope.setAmount = function(anAmount) {
        $scope.gc.amount = anAmount;
        $scope.priceSelectionFlag = false;
        $scope.showBackgroundFlag = false;
      };

      // flag for occasion Selector
      $scope.occasionSelectionFlag = true;
      // flag for send selection flag
      $scope.sendSelectionFlag = true;


      $scope.setBack = function() {
        $scope.priceSelectionFlag = true;
      };
      $scope.setOccasionBack = function() {
        $scope.occasionSelectionFlag = true;
      };
      $scope.isAmount = function(checkAmount) {
        return $scope.gc.amount === checkAmount; // boolean
      };


      /**********
       * Occasion
       **********/
      // import occasions object from OccasionService
      $scope.occasions = OccasionService;

      // set default occasion icon to display
      $scope.occasions.selectedIcon = 'modules/giftcards/img/occasion-custom-icon-blk.png';

      $scope.occasions.charsLeft = 100;
      var occCharLimit = 100; // no need to include the character limit inside $scope

      $scope.setOccasion = function(occasion) {
        // change occasion text only if a new occasion is selected
        $scope.occasionSelectionFlag = false;
        $scope.showBackgroundFlagFour = true;

        if ($scope.gc.Icon !== occasion.name) {
          $scope.gc.occasion = occasion.text;
          $scope.gc.Icon = occasion.name;
          $scope.occasions.selectedIcon = occasion.images.selected;
        }
        //$scope.limitOccText(); // limit occasion text to 100 characters
      };
      /**********
       * Date
       **********/
      // set default img
      $scope.dateTypeImg = 'modules/giftcards/img/send-today-blk.png';

      $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

          for (var i = 0; i < $scope.events.length; i++) {
            var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }

        return '';
      };
      $scope.setDateType = function(type) {
        $scope.sendSelectionFlag = true;
        if (type === 'today')
          $scope.dateTypeImg = 'modules/giftcards/img/send-today-blk.png';
        else if (type === 'on-date')
          $scope.dateTypeImg = 'modules/giftcards/img/send-on-date-blk.png';

      };
      $scope.updateCreditCardImg = function() {
        var type = $.formance.creditCardType($scope.formData.CreditCardNumber);

        var acceptedTypes = ['amex', 'discover', 'mastercard', 'visa'];

        if (acceptedTypes.indexOf(type) !== -1)
          $scope.cardTypeImg = 'modules/giftcards/img/cc-' + type;
        else
          $scope.cardTypeImg = 'modules/giftcards/img/cc-basic';

        var filledIn = $('#creditcardnumbercontainer').hasClass('filledIn');
        if (filledIn)
          $scope.cardTypeImg += '-wht.png';
        else
          $scope.cardTypeImg += '-blk.png';
      };

      $scope.create = function() {
        var giftcard = new Giftcards($scope.gc);
        var payload = {
          card: $scope.cc
        };
        var callback = function(status, response) {
          if (response.error) {
            $scope.error = response.error.message;
          } else {
            giftcard.stripeCardToken = response.id;
            return processPaymentService.findOrCreateUser(giftcard.mobileNumberOfRecipient, giftcard.giftRecipientFirstName)
              .then(function anotherHandler(response) {
                giftcard.spenderofgiftcard = response.data._id;
                return giftcard.$save();
              }).then(function yetAnotherHanlder(response) {
                return $location.path('/giftcards');
              }).catch(function errHandler(errorResponse) {
                $scope.error = errorResponse.error.message;
              });
          }
        };
        Stripe.card.create(payload, callback);
      };


      // Remove existing Giftcard
      $scope.remove = function(giftcard) {
        if (giftcard) {
          giftcard.$remove();

          for (var i in $scope.giftcards) {
            if ($scope.giftcards[i] === giftcard) {
              $scope.giftcards.splice(i, 1);
            }
          }
        } else {
          $scope.giftcard.$remove(function() {
            $location.path('giftcards');
          });
        }
      };

      // Update existing Giftcard
      $scope.send = function() {
        //1. before we can send the giftcard to the user we need the user's id.
        //2. save the giftcard to the that user's id.
        var giftcard = new Giftcards({
          giftRecipientFirstName: 'my friends name',
          amount: 1000,
          mobileNumberOfRecipient: 1234567890,
          merchant: 'aMerchantId here',
          spenderofgiftcardUserName: 'username',
          message: 'A gift for you!',
          districtNumber: 'number',
        });

        giftcard.$save(function() {
          $location.path('giftcards/');
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };


      // Update existing Giftcard
      $scope.update = function() {
        var giftcard = $scope.giftcard;

        giftcard.$update(function() {
          $location.path('giftcards/' + giftcard._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };


      // Find a list of Giftcards
      $scope.find = function() {
        $scope.giftcards = Giftcards.query();
      };

      // Find existing Giftcard
      $scope.findOne = function() {
        $scope.giftcard = Giftcards.get({
          giftcardId: $stateParams.giftcardId
        });
      };
    }
  ]);
