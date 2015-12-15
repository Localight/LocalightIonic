'use strict';

/**
 * @ngdoc service
 * @name localightApp.OccasionService
 * @description
 * # OccasionService
 * Service in the localightApp.
 */

 /*
 * Simply a re-do of old clique code, to keep it working,
 * this service will allow us to access all of
 * the information form an occasions
 * throughout the entire app
 */

angular.module('localightApp')
  .service('OccasionService', function(){

  //Our array of occasions
  var occasions = [
      {
        name: 'birthday',
        images: {
          normal: '../images/occasionIcons/occasion-birthday-icon-wht.png',
          selected: '../images/occasionIcons/occasion-birthday-icon-blk.png',
          iconId: "0"
        },
        alt: 'Birthday',
        text: 'Variety is the spice of life. So I’m giving you the gift of choice!'
      },
      {
        name: 'anniversary',
        images: {
          normal: '../images/occasionIcons/occasion-anniversary-icon-wht.png',
          selected: '../images/occasionIcons/occasion-anniversary-icon-blk.png',
          iconId: "1"
        },
        alt: 'Anniversary',
        text: 'You remind me of time itself for you are my Past, Future, and Forever. Happy Anniversary!'
      },
      {
        name: 'love',
        images: {
          normal: '../images/occasionIcons/occasion-love-icon-wht.png',
          selected: '../images/occasionIcons/occasion-love-icon-blk.png',
          iconId: "2"
        },
        alt: 'I Love You',
        text: 'I Iove you for all that you are, all you have been, and all you\'re yet to be.'
      },
      {
        name: 'getwell',
        images: {
          normal: '../images/occasionIcons/occasion-getwell-icon-wht.png',
          selected: '../images/occasionIcons/occasion-getwell-icon-blk.png',
          iconId: "3"
        },
        alt: 'Get Well',
        text: 'I look forward to your speedy recovery. Get well soon!'
      },
      {
        name: 'congrats',
        images: {
          normal: '../images/occasionIcons/occasion-congrats-icon-wht.png',
          selected: '../images/occasionIcons/occasion-congrats-icon-blk.png',
          iconId: "4"
        },
        alt: 'Congrats',
        text: 'Spread joy. Chase your wildest dreams. Congratulations!'
      },
      {
        name: 'wedding',
        images: {
          normal: '../images/occasionIcons/occasion-wedding-icon-wht.png',
          selected: '../images/occasionIcons/occasion-wedding-icon-blk.png',
          iconId: "5"
        },
        alt: 'Wedding',
        text: 'Falling in love is easy. Staying in love is AMAZING. Congrats on your marriage!'
      },
      {
        name: 'baby',
        images: {
          normal: '../images/occasionIcons/occasion-baby-icon-wht.png',
          selected: '../images/occasionIcons/occasion-baby-icon-blk.png',
          iconId: "6"
        },
        alt: 'Baby',
        text: 'Congratulations on the birth of your child!'
      },
      {
        name: 'sympathy',
        images: {
          normal: '../images/occasionIcons/occasion-sympathy-icon-wht.png',
          selected: '../images/occasionIcons/occasion-sympathy-icon-blk.png',
          iconId: "7"
        },
        alt: 'Sympathy',
        text: 'Our collective hearts are heavy with sympathy.'
      },
      {
        name: 'thankyou',
        images: {
          normal: '../images/occasionIcons/occasion-thankyou-icon-wht.png',
          selected: '../images/occasionIcons/occasion-thankyou-icon-blk.png',
          iconId: "8"
        },
        alt: 'Thank You',
        text: 'You’re the best! You deserve some retail therapy.'
      },
      {
        name: 'holiday',
        images: {
          normal: '../images/occasionIcons/occasion-custom-icon-wht.png',
          selected: '../images/occasionIcons/occasion-custom-icon-blk.png',
          iconId: "9"
        },
        alt: 'Holiday',
        text: "Here's wishing you Happy Holidays and a prosperous New Year!"
      }
    ];


    //Return our occasions by ID and  or the entire array
    return {

        //Get all the occasions
        getAllOccasions: function() {
            return occasions;
        },

        //Return an occasion by it's id
        getOccasionsById: function(Id) {

            //Loop through and find the occasions with the specified Id
            for(var i = 0; i < occasions.length; i++)
            {
                if(occasions[i].images.iconId == Id) {
                    return occasions[i];
                }
            }

            //If nothing is returned, just return the custom occasion
            return occasions[9];
        }
    }
 });
