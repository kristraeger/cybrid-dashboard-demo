(function(){
  'use strict';

  angular.module('dashApp')
         .service('menuService', [MenuService]);

  function MenuService(){

	    var menu = [
	                 {
	                   "title": "Welcome",
	                   "subtitles": [
	                      {
	                	   "title":"Home",
	                	   "icon":"icon-home",
	                	   "url":"#home"
                      }
	                  ]
	                 },
	                 {
	                   "title": "Conversations",
	                   "subtitles": [
  	                      {
   	                	   "title":"All",
   	                	   "icon":"icon-bubbles4",
   	                	   "url":"#conversations/all"
  	   	                   },
   	                      {
   	                	   "title":"Web",
   	                	   "icon":"icon-display",
   	                	   "url":"#conversations/web"
   	                      },
   	                      {
  	                	   "title":"Text",
  	                	   "icon":"icon-mobile",
  	                	   "url":"#conversations/text"
                          },
                          {
                         "title":"Facebook",
                         "icon":"icon-facebook",
                         "url":"#conversations/facebook"
                          }
   	                  ]
	                 },
	              //    {
	              //      "title": "Analytics",
	              //      "subtitles": [
  	            //           {
 	             //    	   "title":"Charts",
 	             //    	   "icon":"icon-stats-dots",
 	             //    	   "url":"#analytics/charts"
     	         //         }
  	            //       ]
		            // },
	                 {
	                   "title": "Training",
	                   "subtitles": [
   	                      {
   	                	   "title":"Train Bot",
   	                	   "icon":"icon-plus",
   	                	   "url":"#training/trainbot"
   	                      },
   	                      {
  	                	   "title":"Database",
  	                	   "icon":"icon-database",
  	                	   "url":"#training/database"
      	                 }
   	                  ]
			        }

	     ];

	    return menu
  }

})();
