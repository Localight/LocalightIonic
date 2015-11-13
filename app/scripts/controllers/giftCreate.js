'use strict';

/**
* @ngdoc function
* @name angularLocalightApp.controller:CreategiftcardCtrl
* @description
* # CreategiftcardCtrl
* Controller of the angularLocalightApp
*/
angular.module('angularLocalightApp')
.controller('CreategiftcardCtrl', function($scope, $http, $routeParams, $location, $window, rotationCheck, $timeout,
    $log, $q, $cookies, OccasionService, Users, Join, Giftcards, LocationByCode, $document) {

        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.cc = {};

        //****
        //Page initialization
        //****

        //Reset the rotation alert boolean
        rotationCheck.reset();

        //Giftcard form object
        $scope.gc = {};

        //Credit card verification fields
        $scope.cardIndex = 0;

        //Server response
        $scope.backendError = false;
        $scope.backendRes = "";

        //Get the session token
        var sessionToken;

        if($location.search().token)
        {
            //get our session token
            sessionToken = $location.search().token;

            //Place the session token in the cookies
            $cookies.put("sessionToken", sessionToken);
        }
        else if($cookies.get("sessionToken"))
        {
            //get our session token from the cookies
            sessionToken = $cookies.get("sessionToken");
        }
        else {
            //Redirect them to a 404
            $location.path("#/");
        }

        //Amount selection slider amount options
        $scope.prices = [2, 5, 10, 25, 50, 75, 100];

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

        //Fuction to focus on a field if the user presses Enter
        $scope.keyPress = function(keyEvent, input) {
            if (keyEvent.which === 13) document.getElementById(input).focus();
        }

        //Chops off end character for specified field
        document.getElementById("clique_input_code").oninput = function () {
            if (this.value.length > 5) {
                this.value = this.value.slice(0,5);
            }
        }

        //Scroll to element by HTML ID
        $scope.scrollToElement = function(elementId, callback) {

            //Pause before executing scroll to allow other events to complete
            $timeout(function() {

                //Find the angular element requested
                var element = angular.element(document.getElementById(elementId));

                //Scroll to the selected element
                $document.scrollToElement(element, 0, 1000, function(t) {
                    if (callback) {
                        //Call the callback after the timeout
                        $timeout(function () {
                            callback();
                        }, 100);
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

            $scope.activeField = fieldId;
            $window.document.getElementById($scope.activeField).style.backgroundColor = "white";
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
                document.getElementById('clique_input_code').focus();
            }, 100);
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

        //Flag for send selection flag
        $scope.sendSelectionFlag = true;

        /****
        * Code
        ****/

        //Validate our code length
        //Optimize
        $scope.codeValidate = function(event) {
            //Our condition to check if it is a number
            var cond = event ? (46 < event.keyCode && event.keyCode < 58) : true;

            $scope.location = {};

            //Check if we met our condition and our length is good
            if($scope.gc.code != null){
                if ($scope.gc.code.toString().length == 5) {
                    //Show the loading spinner
                    $scope.loading = true;

                    LocationByCode.get({
                        code: $scope.gc.code
                    }, function(data, status){
                        //Hide the loading spinner
                        $scope.loading = false;

                        $scope.location.name = data.name;
                        $scope.location = data;

                        $scope.showCard = false;

                        if (event && (event.target.id === 'clique_input_code')) setTimeout(function() {
                            event.target.blur();
                        }, 20);

                        //Scroll to the requested element
                        //Now done by the flip card
                        //$scope.scrollToElement(scrollId);

                        //And set the active field to the occasions
                        $scope.setActiveField(document.getElementById("clique_input_code").getAttribute("nextId"));
                    }, function(err){
                        //Hide the loading spinner
                        $scope.loading = false;
                        alert("Wrong code!");
                    });

                }
            }
        }

        /****
        * Occasion
        ****/

        //Get OccasionService array containing all possible occasion presets
        $scope.occasions = OccasionService;

        //Flag for occasion Selector
        $scope.occasionSelectionFlag = true;

        /**
         * Sets/Unsets the occasion for the occasionPicker.
         * @param {Occasion} occasion Occasion object that was selected
         */
        $scope.setOccasion = function(occasion) {
            //Change occasion text only if a new occasion is selected
            $scope.occasionSelectionFlag = false;
            $scope.showBackgroundFlagFour = true;

            if ($scope.gc.Icon !== occasion.name) {
                $scope.gc.occasion = occasion.text;
                $scope.gc.Icon = occasion.name;
                $scope.occasions.selectedIcon = occasion.images.selected;
                //Also set our occasion ID for our giftcard
                $scope.occasionId = occasion.images.iconId;


            }
        };

        $scope.setOccasionBack = function() {
            $scope.occasionSelectionFlag = true;
            $scope.gc.Icon = "";
            $scope.secondFlag = false;
        };


        /****
        * Date
        ****/

        //Minimum date for datepicker (prevents Android datepicker lag)
        $scope.minDate = new Date().toJSON().slice(0, 10);

        //Set the maximum date (5 years from now), plus 1900 because Y2K (prevents Android datepicker lag)
        $scope.maxDate = new Date();
        $scope.maxDate.setFullYear($scope.maxDate.getFullYear() + 5);
        $scope.maxDate = $scope.maxDate.toJSON().slice(0, 10);

        /**
         * Switch date input type=text to type=date (hack to have a placeholder in a date field)
         */
        $scope.setDate = function() {
            document.getElementById('clique_date_selection').type = 'date';
            //Focus on the date field after setting the type to avoid it blurring
            $timeout(function () {
                document.getElementById('clique_date_selection').disabled = false;
                document.getElementById('clique_date_selection').focus();
            }, 25);
        }

        //Formats the phone contact for contact pasting
        $scope.formatContact = function(elementId) {

            //Remove all special scharacters from like a paste from contacts
            var element = $window.document.getElementById(elementId);

            //Timeout to start a new thread so we can catch the paste
            $timeout(function() {

                //Similar to mask, lets assume it is valid
                $scope.clique_input_phonenumber_validity = true;

                var phone = element.value;
                //Parse only the digits from the phone number
                phone = phone.replace(new RegExp("[^0-9]", "g"), '');
                //Get only the last 10 digits, so we can remove the country codes
                if(phone.length > 10) phone = phone.slice(phone.length - 10, phone.length);

                //Mask the number, if we got a correct paste
                if(phone.length == 10)
                phone = "(" + phone.substring(0, 3) + ")"
                + phone.substring(3, 6) + "-"
                + phone.substring(6, 10);

                //Check if it is valid, and our mask worked perfectly
                if(phone.length != 13) $scope.clique_input_phonenumber_validity = false;

                //Finalize our value into the element!
                element.value = phone;

                //Last but now least, focus on the email
                if($scope.clique_input_phonenumber_validity && phone.length > 12)
                {
                    $timeout(function () {
                        document.getElementById("clique_input_email").focus();
                    }, 250);
                }
            }, 0);
        }

        /**
         * Masks phone number with (xxx)xxx-xxxx format.
         * @param {String} elementId The HTML ID for the element to validate.
         * @param {$event} event The event which triggered the mask.
         */
        $scope.maskPhone = function(elementId, event) {

            //First check if the key pressed was backspace, if it was, dont do the function
            if (!event || event.keyCode != 8) {

                var element = $window.document.getElementById(elementId);

                $scope.clique_input_phonenumber_validity = true;
                var tel = '(';
                var val = element.value.split('');
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


                for (i = 0; i < val.length; i++) {
                    if (i === 3) {
                        val[i] = val[i] + ')';
                    }
                    if (i === 7) {
                        val[i] = val[i] + '-';
                    }
                    tel = tel + val[i];
                }

                //Finalize the value
                element.value = tel;

                //now check if we should focus on the email
                if($scope.clique_input_phonenumber_validity && tel.length > 12)
                {
                    $timeout(function () {
                        document.getElementById("clique_input_email").focus();
                    }, 250);
                }
            }
        }

        /****
        * Credit Card Validation
        ****/

        $scope.dateOptions = {
            onClose: function(e) {
                document.getElementById('clique_date_selection').blur();

                    $scope.dateDirty = true;
                    document.getElementById("clique_input_creditcardnumber1").focus();

                    $scope.$apply();




            }
        }

        //Icon URLs for CCs
        //Default, Visa, Mastercard, Amex, Discover
        var cardIcons = [
            "../images/cc-basic-blk.png",
            "../images/cc-visa-blk.png",
            "../images/cc-mastercard-blk.png",
            "../images/cc-amex-blk.png",
            "../images/cc-discover-blk.png"
        ]
        //Set starter icon to be blank
        $scope.cardIcon = cardIcons[0];

        /**
         * Validates form CC. Checks Stripe for validity, determines card type and sets card icon.
         */
        $scope.validateCardNumber = function(event) {
            //Concatante the credit card number together
            var cardNumber = event.target.value.replace(/-/g, '');

            //Check if the credit card number is US valid
            if(Stripe.card.validateCardNumber(cardNumber) && (cardNumber.length == 13 || cardNumber.length == 15 || cardNumber.length == 16)) {
                $scope.validCC = true;

                //Jump to the date field
                $scope.ccDateSwitch();
            }
            else {
                $scope.validCC = false;
            }

            //Also we should set what card type we have
            var cardType = Stripe.card.cardType(cardNumber);

            var acceptedCards = ["Visa", "MasterCard", "American Express", "Discover"];

            $scope.cardIcon = cardIcons[acceptedCards.indexOf(cardType) + 1];

            //Now see if the card is validated
            $scope.validateCard();
        }

        //Simply focuses on the credit card date fields
        $scope.ccDateSwitch = function () {
            $timeout(function () {
                document.getElementById("clique_input_expiry_m").focus();
            }, 100);
        }

        /**
         * Validates form Date. Checks Stripe for validity.
         */
        $scope.validateDate = function() {
            //Concatante the giftcard number together
            var input1 = document.getElementById("clique_input_expiry_m");
            var input2 = document.getElementById("clique_input_expiry_y");

            $scope.dateValidated = Stripe.card.validateExpiry(input1.value, input2.value);

            //Now see if the card is validated
            $scope.validateCard();
        }

        /**
         * Validates form CVC. Checks Stripe for validity.
         */
        $scope.validateCVC = function() {
            //get the input
            var input1 = document.getElementById("clique_input_cvv");

            $scope.cvcValidated = Stripe.card.validateCVC(input1.value);

            //Now see if the card is validated
            $scope.validateCard();
        }

        /**
         * Validates form zipcode. Checks for length.
         */
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

        /**
         * Checks if all CC fields have been validated independantly
         */
        $scope.validateCard = function() {
            if ($scope.validCC && $scope.dateValidated && $scope.cvcValidated && $scope.zipValidated) {
                $scope.cardValidated = true;

                //Since the card is validated
                //scroll/focus on the continue button
                $scope.scrollToElement("continue_button", function() {
                    $scope.hideCCSpacer = true;
                    document.getElementById('continue_button').focus();
                });

            } else {
                $scope.cardValidated = false;
                $scope.cardType = "";
            }
        }

        /**
         * Validates email field
         */
        $scope.validateEmail = function() {
            //Fetch email from giftcard form
            var email = $scope.gc.email;

            //Regex for all valid emails. To add a TLD, edit the final OR statement.
            var emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|co|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)\b/;
            //Test the form email against the regex
            if (emailRegex.test(email)) {
                return true;
            } else {
                return false;
            }
        }

        $scope.numbersOnly = function(event){
            if(((event.which < 48 || event.which > 57) && event.which != 46 && event.which != 8) || event.shiftKey){
                event.preventDefault();
            }
        }

        $scope.maxLength = function(event, length){
            if (event.target.value.length > length && event.which != 46 && event.which != 8) {
                event.preventDefault();
                event.target.value = event.target.value.slice(0,length);
            } else if (event.target.value.length == length && event.which != 46 && event.which != 8){
                event.preventDefault();
            }
        }

        function getCaretPosition(ctrl)
        {
            var caretPos = 0;
            // IE
            if (document.selection)
            {
                ctrl.focus ();
                var sel = document.selection.createRange();
                sel.moveStart ('character', -ctrl.value.length);
                caretPos = sel.text.length;
            }
            // Firefox
            else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            {
                caretPos = ctrl.selectionStart;
            }

            return caretPos;
        }

        function setCaretPosition(elemId, caretPos) {
            var elem = document.getElementById(elemId);

            if(elem != null) {
                if(elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.move('character', caretPos);
                    range.select();
                }
                else {
                    if(elem.selectionStart) {
                        elem.focus();
                        elem.setSelectionRange(caretPos, caretPos);
                    }
                    else
                        elem.focus();
                }
            }
        }

        $scope.formatCC = function(event){
            var caretPos = getCaretPosition(event.target) == event.target.value.length ? -3 : getCaretPosition(event.target);
            if(event.which == 46 || event.which == 8){
                var value = event.target.value.replace(/-/g, '');

                if(value.length > 4){
                    value = [value.slice(0, 4), "-", value.slice(4)].join('');

                    if(value.length > 9){
                        value = [value.slice(0, 9), "-", value.slice(9)].join('');

                        if(value.length > 14){
                            value = [value.slice(0, 14), "-", value.slice(14)].join('');
                        }
                    }
                }
                event.target.value = value;

            } else if(event.which >= 48 && event.which <= 57){
                var value = event.target.value.replace(/-/g, '');

                if(value.length >= 4){
                    value = [value.slice(0, 4), "-", value.slice(4)].join('');

                    if(value.length >= 9){
                        value = [value.slice(0, 9), "-", value.slice(9)].join('');

                        if(value.length >= 14){
                            value = [value.slice(0, 14), "-", value.slice(14)].join('');
                        }
                    }
                }
                if(caretPos == 4 || caretPos == 9 || caretPos == 14){
                    caretPos++;
                }
                event.target.value = value;
            }
            if(caretPos >= 0){
                setCaretPosition(event.target.id, caretPos);
            }
            $scope.validateCardNumber(event);
        }

        /*
        STRIPE
        ------
        ------
        */

        //Setting our stripe key
        Stripe.setPublishableKey('pk_test_oaWeW8CRcbIpTqz70F5OsbKG');

        /**
         * Assembles CC info and creates a token with Stripe
         */
        $scope.tokenizeInfo = function() {

            //Show(true)/Hide(false) the loading spinner
            $scope.loading = true;

            //Disable button while tokenzing the card
            $scope.tokenzing = true;

            //Create finalized card number
            var cardNumber = $scope.cc.number;

            //Send card info to stripe for tokenization
            Stripe.card.createToken({
                "number": cardNumber,
                "cvc": $scope.cc.cvc,
                "exp_month": $scope.cc.ExpiryM,
                "exp_year": $scope.cc.ExpiryY
            }, function(status, response) {
                if (response.error) {
                    //Show(true)/Hide(false) the loading spinner
                    $scope.loading = false;

                    //Display card error message
                    $scope.tokenizeFailure = true;
                } else {
                    //Get the token to be submitted later, after the second page
                    // response contains id and card, which contains additional card details
                    $scope.stripeToken = response.id;

                    //Show the next page
                    $scope.showPage2 = true;

                    //Show(true)/Hide(false) the loading spinner
                    $scope.loading = false;

                    //timeout and focus on the phone field
                    $timeout(function() {
                        //focus on the phone element
                        document.getElementById("clique_input_phonenumber").focus();

                        //Go back to the top
                        $window.scrollTo(0, 0);
                    }, 250);
                }

                //Force the change to refresh, we need to do this because I
                //guess response scope is a different scope and has to be
                //forced or interacted with
                $scope.$apply();
            });
        };

        //Finally SUBMIT EVERYTHING to the backend!
        $scope.submitGiftcard = function() {
            //Show(true)/Hide(false) the loading spinner
            $scope.loading = true;


            //Creating the users Json
            var payload = {
                "sessionToken": sessionToken,
                "name": $scope.gc.from,
                "email": $scope.gc.email
            };

            //If it is successful, Update the spending user
            var updateUser;
            Users.update(payload,
                function(data, status) {

                //Success, First, fix the formatting on the phone
                //This will remove all special characters from the string
                var formattedPhone = $scope.gc.phoneNumber.replace(/[^a-zA-Z0-9]/g, '');

                //Also, we need to convert our amount into integers
                var intAmount = $scope.gc.amount * 100;

                //Create a giftcard
                var newGiftcardPayload= {
                    "sessionToken": sessionToken,
                    "toName": $scope.gc.to,
                    "fromName": $scope.gc.from,
                    "email": $scope.gc.email,
                    "phone": formattedPhone,
                    "amount": intAmount,
                    "iconId": $scope.occasionId,
                    "locationId": $scope.location._id,
                    "subId": $scope.location.subId,
                    "message": $scope.gc.occasion,
                    "stripeCardToken": $scope.stripeToken
                }

                //Send the giftcard to the backend to be created
                var newGiftcard;
                Giftcards.create(newGiftcardPayload,
                    function(data, status) {

                        //Disable the charging button for slower devices,
                        //since the loading symbol will disappear before
                        //they navigate to the sent page
                        $scope.disableSubmit = true;

                        //Success, Store the phone number and email in the cookies
                        $cookies.put("phone", $scope.gc.phoneNumber);
                        $cookies.put("email", $scope.gc.email);

                        //Go to the sent page
                        $location.path("/sent");

                        //Show(true)/Hide(false) the loading spinner
                        $scope.loading = false;
                },
                function(err) {

                    //Show(true)/Hide(false) the loading spinner
                    $scope.loading = false;

                    //Error, Inform the user of the status
                    console.log("Status: " + err.status + " " + err.data.msg);
                    $scope.backendError = true;
                    $scope.backendRes = updateUser.msg;
                });
            },
            function(err) {

                //Show(true)/Hide(false) the loading spinner
                $scope.loading = false;

                //Re enable the submit button
                $scope.giftSubmit = false;

                //Error, Inform the user of the status
                console.log("Status: " + err.status + " " + err.data.msg);
                $scope.backendError = true;
                $scope.backendRes = updateUser.msg;
            });
        }

        //****
        //Second initialization stage
        //****

        //Start the first field highlighted
        //Optimize
        $scope.setActiveField('clique_to');

    });
