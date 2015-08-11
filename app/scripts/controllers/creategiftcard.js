'use strict';

/**
* @ngdoc function
* @name angularLocalightApp.controller:CreategiftcardCtrl
* @description
* # CreategiftcardCtrl
* Controller of the angularLocalightApp
*/
angular.module('angularLocalightApp')
.controller('CreategiftcardCtrl', function($scope, $http, $routeParams, $location, $window, $timeout,
    $log, $q, $cookies, OccasionService, Users, Join, Giftcards, $document) {

        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.keyPress = function(keyEvent, input) {
            if (keyEvent.which === 13) document.getElementById(input).focus();
        }

        //****
        //Page initialization
        //****

        //Rotation warning shown
        $scope.rotateAlert = false;

        //Rotation warning detector
        $window.addEventListener("orientationchange", function() {
            if (!$scope.rotateAlert && ($window.orientation == -90 || $window.orientation == 90)) {
                $scope.rotateAlert = true;
                alert("Please disable device rotation, this application is meant to be used in portrait mode. You could risk spending a giftcard incorrectly, or losing your data.");
            }
        }, false);

        //Switch dark overlay off
        document.getElementById('darkerOverlay').style.display = "none";

        //Giftcard form object
        $scope.gc = {};

        //Credit card verification fields
        $scope.cardIndex = 0;
        $scope.cardValidated = false;
        $scope.numberValidated = false;
        $scope.dateValidated = false;
        $scope.cvcValidated = false;
        $scope.zipValidated = false;

        //Server response
        $scope.backendError = false;
        $scope.backendRes = "";

        //Store session token from url
        var sessionToken = $routeParams.token;
        $cookies.put("sessionToken", sessionToken);

        //Amount selection slider amount options
        $scope.prices = [2, 5, 10, 25, 50, 75, 100];

        //Focus on "to" field when document is done loading
        angular.element(document).ready(function() {
            document.getElementById("clique_input_to").focus();
        });

        //Secondary form field highlighting (form field suggestions)
        $scope.secondaryField = null;
        $scope.secondaryIndex = 0;
        $scope.inputFields = [
            "clique_amt_selection",
            "clique_from",
            "clique_code",
            "clique_occasion_wrapper",
            "clique_date_selection",
            "creditcardinfo"
        ]

        //****
        //General functions
        //****

        //Scroll to element by HTML ID
        $scope.scrollToElement = function(elementId, callback) {
            //Pause before executing scroll to allow other events to complete
            setTimeout(function() {
                //Find the angular element requested
                var element = angular.element(document.getElementById(elementId));
                //Scroll to the selected element
                $document.scrollToElement(element, 0, 1000, function(t) {
                    if (callback) {
                        callback();
                    }
                    //Use cubic easing math
                    return 1 - (--t) * t * t * t
                });
            }, 100);
        }

        //Sets the current active field background
        $scope.setActiveField = function(fieldId) {

            if ($scope.activeField && $scope.activeField != fieldId) {
                $window.document.getElementById($scope.activeField).style.backgroundColor = 'transparent';
            }

            if (fieldId == "clique_from") $window.document.getElementById("localStreetNoBlur").className = "localStreet blur";

            //Check if it is the occasion wrapper, if it is, we need to turn white into transparent
            if (fieldId.indexOf("clique_occasion_wrapper") > -1) {
                //Check if the active field is already occasion wrapper
                if ($scope.occasionSelectionFlag) {
                    //Make the occasion transparent
                    $scope.activeField = fieldId;
                    $window.document.getElementById($scope.activeField).style.backgroundColor = 'transparent';
                } else {
                    //Make the occasion white
                    $scope.activeField = fieldId;
                    $window.document.getElementById($scope.activeField).style.backgroundColor = "white";
                }
            } else {
                $scope.activeField = fieldId;
                $window.document.getElementById($scope.activeField).style.backgroundColor = "white";
            }
        };

        $scope.setSecondaryField = function(next) {
            if (next >= $scope.secondaryIndex) {
                $scope.secondaryIndex = next;
                $scope.secondaryField = $scope.inputFields[next];
            }
            $window.document.getElementById($scope.secondaryField).style.backgroundColor = "rgba(255, 255, 255, 0.35)";
        }

        //Set the secondary field to clique_amt_selection
        $scope.setSecondaryField(0);

        //Scroll to clique_payment_card when clique_date_selection is valid
        $scope.$watch('giftcardForm.clique_date_selection.$valid', function(newValue, oldValue) {
            if (newValue) {
                //Scroll to the bottom
                $scope.scrollToElement("clique_payment_card", function() {
                    document.getElementById('clique_input_creditcardnumber1').focus();
                });
            }
        });

        $scope.flipCard = function() {
            //Do this in a timeout to support showing the card and then flipping
            $timeout(function() {
                //Add the classes to the front and back
                var frontCard = $window.document.getElementById("front");
                var backCard = $window.document.getElementById("back");

                frontCard.className = frontCard.className + " flipped";
                backCard.className = backCard.className + " flipped";
            }, 500);
        };

        $scope.setAmount = function(amount) {
            //Store form amount
            $scope.gc.amount = amount;

            //Hide the amount picker
            $scope.amountSelected = true;

            //Focus on "from"
            //Timeout prevents android keyboard from hiding
            $timeout(function() {
                document.getElementById('clique_input_from').focus();
            }, 100);
        };

        //Flag for occasion Selector
        $scope.occasionSelectionFlag = true;
        //Flag for send selection flag
        $scope.sendSelectionFlag = true;

        $scope.setOccasionBack = function() {
            $scope.occasionSelectionFlag = true;
        };

        /**********
        * Code
        **********/

        //Validate our code length
        //Optimize
        $scope.codeValidate = function(id, event, maxlength, scrollId, activeId) {
            //Grab our element
            var element = $window.document.getElementById(id);
            //get our element length
            var len = element.value.toString().length + 1;
            //get the max length we assigned to it
            var max = element.maxLength;

            //Our condition to check if it is a number
            var cond = (46 < event.keyCode && event.keyCode < 58);

            //Check if we met our condition and our length is good
            if (len >= maxlength) {
                $scope.showCard = false;

                if (id == 'clique_input_code') setTimeout(function() {
                    document.getElementById(id).blur();
                }, 20);

                //Scroll to the requested element
                $scope.scrollToElement(scrollId);

                //And set the active field to the occasions
                $scope.setActiveField(activeId);
            }
            if (len > maxlength || !cond) {
                event.preventDefault();
            }
        }

        //temporary function for getting a merchant name for a code
        $scope.getMerchantName = function() {
            //get our code value here
            var element = $window.document.getElementById('clique_input_code');
            var code = element.value.toString();

            //do stuff to return the correct name
            return "MADE in Long Beach"
        }


        /**********
        * Occasion
        **********/

        //Get OccasionService array
        $scope.occasions = OccasionService;

        $scope.setOccasion = function(occasion) {
            // change occasion text only if a new occasion is selected
            $scope.occasionSelectionFlag = false;
            $scope.showBackgroundFlagFour = true;

            if ($scope.gc.Icon !== occasion.name) {
                $scope.gc.occasion = occasion.text;
                $scope.gc.Icon = occasion.name;
                $scope.occasions.selectedIcon = occasion.images.selected;
                //Also set our occasion ID for our giftcard
                $scope.occasionId = occasion.images.iconId;

                //Also bring up they keyboard
                $timeout(function() {
                    document.getElementById('clique_input_occasion').focus();
                }, 100);
            }
            //$scope.limitOccText(); // limit occasion text to 100 characters
        };


        /**********
        * Date
        **********/

        // set default img
        $scope.dateTypeImg = '../images/send-today-blk.png';

        //Set the minimum date
        $scope.minDate = new Date().toJSON().slice(0, 10);

        //Set the maximum date (5 years from now), plus 1900 because Y2K
        $scope.maxDate = new Date();
        $scope.maxDate.setFullYear($scope.maxDate.getFullYear() + 5);
        $scope.maxDate = $scope.maxDate.toJSON().slice(0, 10);

        //set as date instead of input
        $scope.setDate = function() {
            document.getElementById('clique_date_selection').type = 'date';
            document.getElementById('clique_date_selection').focus();
        }

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
            $scope.dateTypeImg = '../images/send-today-blk.png';
            else if (type === 'on-date')
            $scope.dateTypeImg = '../images/send-on-date-blk.png';

        };
        $scope.updateCreditCardImg = function() {
            var type = $.formance.creditCardType($scope.formData.CreditCardNumber);

            var acceptedTypes = ['amex', 'discover', 'mastercard', 'visa'];

            if (acceptedTypes.indexOf(type) !== -1)
            $scope.cardTypeImg = '../images/cc-' + type;
            else
            $scope.cardTypeImg = '../images/cc-basic';

            var filledIn = $('#creditcardnumbercontainer').hasClass('filledIn');
            if (filledIn)
            $scope.cardTypeImg += '-wht.png';
            else
            $scope.cardTypeImg += '-blk.png';
        };

        //Mask for translating and validating phone numbers
        $scope.mask = function(f, event) {

            //First check if the key pressed was backspace, if it was, dont do the function
            if (event.keyCode != 8) {
                f = $window.document.getElementById(f);
                $scope.clique_input_phonenumber_validity = true;
                var tel = '(';
                var val = f.value.split('');
                for (var i = 0; i < val.length; i++) {
                    if (val[i] === '(') {
                        val[i] = '';
                    }
                    if (val[i] === ')') {
                        val[i] = '';
                    }
                    if (val[i] === '-') {
                        val[i] = '';
                    }
                    if (val[i] === '') {
                        val[i] = '';
                    }
                    if (isNaN(val[i])) {
                        $scope.clique_input_phonenumber_validity = false;
                    }
                }
                //
                for (i = 0; i < val.length; i++) {
                    if (i === 3) {
                        val[i] = val[i] + ')';
                    }
                    if (i === 7) {
                        val[i] = val[i] + '-';
                    }
                    tel = tel + val[i];
                }
                f.value = tel;
            }

            //Now check if we can scroll to the next field
            if (f.value.length > 11) {
                //$scope.scrollToElement("bottom");
            }
        }

        //Credit card Verification

        //Stripe icons for cards
        //Default, Visa, Mastercard, Amex, Discover
        $scope.cardIcons = [
            "../images/cc-basic-blk.png",
            "../images/cc-visa-blk.png",
            "../images/cc-mastercard-blk.png",
            "../images/cc-amex-blk.png",
            "../images/cc-discover-blk.png"
        ]

        //Stripe verification fileds
        $scope.validateCardNumber = function() {
            //Concatante the giftcard number together
            var input1 = document.getElementById("clique_input_creditcardnumber1");
            var input2 = document.getElementById("clique_input_creditcardnumber2");
            var input3 = document.getElementById("clique_input_creditcardnumber3");
            var input4 = document.getElementById("clique_input_creditcardnumber4");

            //concatante the values, using dashes so they wont add together, and stripe supports
            var cardNumber = input1.value + "-" + input2.value + "-" + input3.value + "-" + input4.value;

            $scope.numberValidated = Stripe.card.validateCardNumber(cardNumber);

            //Also we should set what card type we have
            var cardType = Stripe.card.cardType(cardNumber);

            //Now set our array index for card type
            if (cardType.indexOf("Visa") > -1) {
                $scope.cardIndex = 1;
            } else if (cardType.indexOf("MasterCard") > -1) {
                $scope.cardIndex = 2;
            } else if (cardType.indexOf("American Express") > -1) {
                $scope.cardIndex = 3;
            } else if (cardType.indexOf("Discover") > -1) {
                $scope.cardIndex = 4;
            }
            //It is unkown go back to default
            else {
                $scope.cardIndex = 0;
            }

            //Now see if the card is validated
            $scope.validateCard();
        }

        $scope.validateDate = function() {
            //Concatante the giftcard number together
            var input1 = document.getElementById("clique_input_expiry_m");
            var input2 = document.getElementById("clique_input_expiry_y");

            $scope.dateValidated = Stripe.card.validateExpiry(input1.value, input2.value);

            //Now see if the card is validated
            $scope.validateCard();
        }

        $scope.validateCVC = function() {
            //get the input
            var input1 = document.getElementById("clique_input_cvv");

            $scope.cvcValidated = Stripe.card.validateCVC(input1.value);

            //Now see if the card is validated
            $scope.validateCard();
        }

        $scope.validateZip = function() {
            //get the input
            var input1 = document.getElementById("clique_input_zip");

            //Simply check if there are 5 digits
            if (input1.value.length > 4) {
                $scope.zipValidated = true;
            } else {
                $scope.zipValidated = false;
            }

            //Now see if the card is validated
            $scope.validateCard();
        }

        $scope.validateCard = function() {
            if ($scope.numberValidated && $scope.dateValidated && $scope.cvcValidated && $scope.zipValidated) {
                $scope.cardValidated = true;
            } else {
                $scope.cardValidated = false;
                $scope.cardType = "";
            }
        }

        $scope.validateEmail = function() {
            //get the email
            var email = $scope.gc.email;

            //check if the email has an @ sign
            if (email.indexOf("@") > -1) {
                //If it does, get a sub string after that, and check for a period
                if (email.substring(email.indexOf("@"))
                .indexOf(".") > -1) {
                    //if it exists return true
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }


        /*
        STRIPE
        ------
        ------
        */

        //Setting our stripe key
        Stripe.setPublishableKey('pk_test_XHrjrZeUDNIITwzqrw9OEpQG');

        //Our stripe token for their card
        $scope.stripeToken;
        $scope.tokenizing = false;
        $scope.tokenizeFailure = false;


        // finish the form, see if anything else is needed
        $scope.tokenizeInfo = function() {
            //disable the submit button
            $scope.tokenizing = true;

            //Collect the credit card form info
            $scope.finalCard = {};

            //First concatanate the number, use dashes to keep things from adding
            var cardNumber = $scope.cc.number1 + "-" + $scope.cc.number2 + "-" + $scope.cc.number3 + "-" + $scope.cc.number4;
            //Add card number to our finalCard
            $scope.finalCard.number = cardNumber;

            //Add the cvc
            $scope.finalCard.cvc = $scope.cc.cvc;

            //Add the month and year (used with an undescore)
            $scope.finalCard.exp_month = $scope.cc.ExpiryM;
            $scope.finalCard.exp_year = $scope.cc.ExpiryY;

            //Now send to stripe to be tokenized
            Stripe.card.createToken($scope.finalCard, $scope.stripeResponseHandler);
        };

        $scope.stripeResponseHandler = function(status, response) {
            if (response.error) {
                //Inform the user
                $scope.tokenizeFailure = true;

            } else {
                //Tokenizing was a success!
                $scope.tokenizeFailure = false;

                //Get the token to be submitted later, after the second page
                // response contains id and card, which contains additional card details
                $scope.stripeToken = response.id;

                //Show the next page
                $scope.showPage2 = true;
            }

            //Force the change to refresh, we need to do this because I
            //guess response scope is a different scope and has to be
            //forced or interacted with
            $scope.$apply();


            //We are no longer tokenizing
            $scope.tokenizing = false;

        };


        //Finally SUBMIT EVERYTHING!

        $scope.submitGiftcard = function() {
            //Creating the users Json
            var userJson = {
                "sessionToken": sessionToken,
                "name": $scope.gc.from,
                "email": $scope.gc.email
            };

            //If it is successful, Update the spending user
            var updateUser = Users.update(userJson, function() {
                if (updateUser.errorid) {
                    $scope.backendError = true;
                    $scope.backendRes = updateUser.msg;
                    return;
                } else {
                    //First, fix the formatting on the phone
                    //This will remove all special characters from the string

                    var formattedPhone = $scope.gc.phoneNumber.replace(/[^a-zA-Z0-9]/g, '');

                    //Also, we need to convert our amount into integers
                    var intAmount = $scope.gc.amount * 100;

                    //Create a giftcard
                    var newGiftcardJson = {
                        "sessionToken": sessionToken,
                        "name": $scope.gc.to,
                        "phone": formattedPhone,
                        "amount": intAmount,
                        "iconId": $scope.occasionId,
                        "message": $scope.gc.occasion,
                        "stripeCardToken": $scope.stripeToken
                    }

                    var newGiftcard = Giftcards.create(newGiftcardJson, function() {
                        if (newGiftcard.errorid) {
                            $scope.backendError = true;
                            $scope.backendRes = newGiftcard.msg;
                            return;
                        } else {
                            //SUCCESSSSSSSS

                            //Store the phone number and email in the cookies
                            $cookies.put("phone", $scope.gc.phoneNumber);
                            $cookies.put("email", $scope.gc.email);

                            //For testing Go to the sent page
                            $location.path("/sent");
                        }
                    });
                }
            });
        }

        //****
        //Second initialization stage
        //****

        //Start the first field highlighted
        //Optimize
        $scope.setActiveField('clique_to');

    });
