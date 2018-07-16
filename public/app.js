
var app = angular.module('dashApp', ['chart.js', 'ngMaterial', 'md.data.table', 'ngMessages', 'firebase', 'ngRoute', 'angularCSS'])

app.config(function($mdThemingProvider, $mdIconProvider){

    $mdIconProvider
        .defaultIconSet("./assets/svg/avatars.svg", 128)
        .icon("menu"       , "./assets/svg/menu.svg"        , 24)
        .icon("share"      , "./assets/svg/share.svg"       , 24)
        .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
        .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
        .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
        .icon("phone"      , "./assets/svg/phone.svg"       , 512);

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey')
            .accentPalette('deep-purple')
});

app.config(['$routeProvider',
    	function($routeProvider) {
    	  $routeProvider.
	  	    when('/', {
	  	       templateUrl: '/login.html',
	  	       controller: 'LoginCtrl'
	  	    }).
    	    when('/home', {
    	      templateUrl: 'src/views/home.html',
    	      controller: 'MainCtrl',
            requireAuth: true
    	    }).
    	    when('/conversations/all', {
    	      templateUrl: 'src/views/conversations.html',
    	      controller: 'ConversationsCtrl',
            requireAuth: true
    	    }).
    	    when('/conversations/web', {
    	      templateUrl: 'src/views/conversations.html',
    	      controller: 'WebConversationsCtrl',
            requireAuth: true
    	    }).
    	    when('/conversations/text', {
    	      templateUrl: 'src/views/conversations.html',
    	      controller: 'TextConversationsCtrl',
            requireAuth: true
    	    }).
    	    when('/analytics/charts', {
    	       templateUrl: 'src/views/charts.html',
    	        controller: 'ChartsCtrl',
              // removed 'http://cdn.jsdelivr.net/bootstrap/3/css/bootstrap.css',
              css: ['http://cdn.jsdelivr.net/bootstrap.daterangepicker/2/daterangepicker.css'],
              requireAuth: true
    	    }).
          when('/conversations/facebook', {
            templateUrl: 'src/views/conversations.html',
            controller: 'FacebookConversationsCtrl',
            requireAuth: true
          }).
          when('/training/database', {
            templateUrl: 'src/views/database.html',
            controller: 'DatabaseCtrl',
            requireAuth: true
          }).
          when('/training/trainbot', {
            templateUrl: 'src/views/trainbot.html',
            controller: 'TrainbotCtrl',
            requireAuth: true
          }).
    	    otherwise({
    	       redirectTo: '/'
    	    });
    	}
]);

app.config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
//      chartColors: ['#FF5252', '#FF8A80'],
      responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
      showLines: true
    });
    // Configure all line charts
    ChartJsProvider.setOptions('line', {
      responsive: true
    });
}])

app.factory('chatsRef', [ function(){

	return function () {
      if(chatApp){
        return chatApp.database().ref();
      }
        return
    };

}])

app.factory('replyRef', [ function(){

	return function () {
        if(replyApp){
          return replyApp.database().ref();
        }
        return
    };

}])
