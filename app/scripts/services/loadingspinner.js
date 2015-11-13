'use strict';

/**
 * @ngdoc service
 * @name angularLocalightApp.loadingSpinner
 * @description
 * # loadingSpinner
 * Service in the angularLocalightApp.
 */
angular.module('angularLocalightApp')
  .service('loadingSpinner', function ($timeout) {

      //The super cool loading stack system!
      var loadingStack = [];
      var errorStack = [];

      //Function to push onto the error stack
      function errorTimeout(msg, devMsg) {

          //Return a timeout to show a message if it does nt exectue after a set time
          return $timeout(function () {

              errorStack.push(msg);

              console.log(devMsg);

              return false;

          }, 10000);

      }

      //Our functions to be returned from the service
      return {

          //Function to push onto the loading stack and error stack
          //Param: Message of what is loading
          load: function(message) {

              //Create an object Id
              var randomId = "loading" + loadingStack.length + Math.floor(Math.random() * (9999 - 1000) + 1000);

              //Get default messages

              //Set up the loading!
              loadingStack.push(
                  {
                      request: errorTimeout("Sorry, but the server is not giving us a response. Please check your internet connection, or the server may be down." +
                      " If this persists, please try again at a later time",
                      "The server never gave a response"),
                      msg: message,
                      id: randomId
                  });

             return randomId;
         },

          //Function to push onto the error stack
          //Param: Message to display to the user, Message to output into the console
          showError: function (userMessage, consoleMessage) {
              errorTimeout(userMessage, consoleMessage)
          },

          //Function to pop off of the loading stack
          stopLoading: function(loadingId) {

              //Search through the stack and pop the error
              for(var i = 0; i < loadingStack.length; i++) {

                  //If the id is correct, Pop it from the stack and break
                  if(loadingStack[i].id == loadingId){

                      $timeout.cancel(loadingStack[i].request);
                      loadingStack.splice(i, 1);
                      break;
                  }

              }
          },

          //Function to return the loading stack
          loading: loadingStack,

          //Function to return the error stack
          error: errorStack
      }

  });
