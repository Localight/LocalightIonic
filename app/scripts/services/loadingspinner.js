'use strict';

/**
 * @ngdoc service
 * @name localightApp.loadingSpinner
 * @description
 * # loadingSpinner
 * Service in the localightApp.
 */
angular.module('localightApp')
  .service('loadingSpinner', function ($timeout) {

      //The super cool loading stack system!
      var loadingStack = [];
      var messageStack = [];
      var errorStack = [];

      //Function to push onto the error stack
      function errorTimeout(msg, devMsg, timeout) {

          //Check if it is supposed to be timedout, or instant
          if(timeout) {

              //Return a timeout to show a message if it doesn't exectue after a set time
              return $timeout(function () {

                  errorStack.push(msg);

                  console.log(devMsg);

                  return false;

              }, 10000);
          }

          //No Timeout, simply show error
          else {
              errorStack.push(msg);

              console.log(devMsg);

              return false;
          }

      }

      //Our functions to be returned from the service
      return {

          //Function to put on our messages array
          //Param: the url route or key to serve as the loading identifier
          setMessage: function(route, message, noError) {
              messageStack.push(
                  {
                      key: route,
                      msg: message,
                      noError: noError
                  }
              );
          },

          //Function to get a message from the messages array
          //Param: the url route or key to serve as the loading identifier
          getMessage: function(url) {

              //Get the message, delete it, and then return
              var tempMessage = "";
              for(var i = 0; i < messageStack.length; i++)
              {
                  //Find the key
                  if(url = messageStack[i].key)
                  {
                      tempMessage = messageStack[i];
                      messageStack.splice(i, 1);
                      break;
                  }
              }

              //If no message is found, simply return loading
              if(!tempMessage.msg) {
                  tempMessage = {
                      key: "loading",
                      msg: "Loading...",
                      noError: false
                  }
              }

              return tempMessage;
          },

          //Function to push onto the loading stack and error stack
          //Param: Message of what is loading
          //Param: noError, signifies error handling is handled somewhere else
          load: function(message, route) {

              //Check if the function is doing it's own error checking
              var errorCheck = false;
              if(message.noError != null && message.noError) errorCheck = true;

              //Set up the loading!
              loadingStack.push(
                  {
                      key: route,
                      request: errorTimeout("Sorry, but the server is not giving us a response. Please check your internet connection, or the server may be down." +
                      " If this persists, please try again at a later time",
                      "The server never gave a response",
                      true),
                      msg: message.msg,
                      noError: errorCheck
                  }
              );
         },

         //Function to pop off of the loading stack
         //Param: the url route or key to serve as the loading identifier
         stopLoading: function(route) {

             //Cancel the timeout, and delete the loading object
             if(route) {

                 //Find the key
                 for(var i = 0; i < loadingStack.length; i++)
                 {
                     if(route == loadingStack[i].key)
                     {
                         //cancel the timeout, and stop loading
                         $timeout.cancel(loadingStack[i].request);
                         loadingStack.splice(i, 1);
                         break;
                     }
                 }
             }
         },

          //Function to push onto the error stack
          //Param: Message to display to the user, Message to output into the console
          showError: function (userMessage, consoleMessage, route) {

              //First find the index
              var index = 0;

              for(var i = 0; i < loadingStack.length; i ++)
              {
                  if(route == loadingStack[i].key) {
                      index = i;
                      break;
                  }
              }

              //First check if we are supposed to
              //Stop the loading and check for noError
              if(route && !loadingStack[index].noError)
              {
                  //Push our error onto the stack
                  errorTimeout(userMessage, consoleMessage, false);

                  //Then Pop off all of the loading requests, to simply show the error
                  while(loadingStack.length > 0)
                  {
                      $timeout.cancel(loadingStack[loadingStack.length - 1].request);
                      loadingStack.pop()
                  }
              }
              else {
                  //Simply just pop the noError from the loading since its already being handled
                  $timeout.cancel(loadingStack[index].request);
                  loadingStack.splice(index, 1);
              }
          },

          //Function to return both the loading and
          //Error stack for our controllerAs
          init: function () {

              //Create an object with everything needed
              var stacks = {
                  load: loadingStack,
                  error: errorStack
              }

              //Return the object
              return stacks;
          },

          //Function to return the loading stack
          loading: loadingStack,

          //Function to return the error stack
          error: errorStack,

          //Function to return the message stack
          message: messageStack
      }

  });
