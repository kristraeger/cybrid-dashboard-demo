angular.module('dashApp')
    .controller('MenuCtrl', [
       '$rootScope',
       '$scope',
       'chatsRef',
       '$mdSidenav',
       'menuService',
       '$location',
      function ($rootScope, $scope, chatsRef, $mdSidenav, menuService, $location) {

      console.log('MenuCtrl');

      if(!window.sessionStorage.currentUserID){
        return $location.path('/login.html#')
      }

      // display app TODO: add a delay for a smoother transition
      document.getElementById('user-signed-in').className = 'active';

      //who's dashboard?
      $scope.botName = window.sessionStorage.getItem('botName')
      console.log('loading data for: '+$scope.botName)

      // default state of data download from database
      $rootScope.dataLoaded = false

      // initialize variable to store all chats
      $rootScope.chatArray = []

      // store all texts chats
      $rootScope.textArray = []

      // store all web chats
      $rootScope.webArray = []

      // store all facebook chats
      $rootScope.facebookArray = []

      chatsRef().on('child_added', function(snapshot) {
        if(!$rootScope.dataLoaded){
          return
        }
        else if ($rootScope.dataLoaded) {
           // do something here
          $rootScope.$broadcast('chats-updated');
          console.log('updating chats child_added')
         }
       });

      chatsRef().on('child_changed', function(snapshot) {
        if(!$rootScope.dataLoaded){
          return
        }
        else if ($rootScope.dataLoaded) {
           // do something here
          $rootScope.$broadcast('chats-updated');
          console.log('updating chats child_changed')
         }
       });

      chatsRef().on('child_removed', function(snapshot) {
        if(!$rootScope.dataLoaded){
          return
        }
        else if ($rootScope.dataLoaded) {
           // do something here
          $rootScope.$broadcast('chats-updated');
          console.log('updating chats child_removed')
         }
       });

      //==== LOGOUT

        document.getElementById('btnLogout').addEventListener('click', function() {
            console.log("logging out")
            window.location.href = '/login.html';
            document.getElementById('user-signed-in').className = 'hide not-active';
            document.getElementById('loading').className = 'hide not-active';
            document.getElementById('loaded').className = 'not-active';
        });

      //==== CREATE SIDEBAR

       // hide and show left side nav bar
       $scope.toggleList = function() {
           $mdSidenav('left').toggle();
         }

        // load menu list
        $scope.menu = menuService

        // select menu item in sidebar
       $scope.selectMenu = function(item) {
         $scope.selected = angular.isNumber(item) ? self.menu[item] : item;
         // change to selected page
         document.location.href = item.url
       }

       // set default to first item on list (home/Overview)
       $scope.selectMenu($scope.menu[0].subtitles[0])

      //==== AUTH

      $scope.$on('$routeChangeStart', function(angularEvent, newUrl) {

        var user = sessionStorage.getItem('currentUserID');

          if (newUrl.requireAuth && !user) {
              // User isn’t authenticated
              console.log("not authenticated")
              window.location.href = '/login.html';
          }

      });

      // ============== SET DATES IN CONVERSATIONS VIEW

    // function to define date range objects
    $rootScope.setDates = function(){
      var now = new Date()
      var nowyear = now.getFullYear()
      var nowday = now.getDate()
      var nowmonth = (now.getMonth())
      var nowweekday = (now.getDay()-1)

      var nowUnix = now.getTime()

      var today = new Date(nowyear, nowmonth, nowday)
      var todayUnix = today.getTime()

      var yesterday = new Date(nowyear, nowmonth, nowday -1)
      var yesterdayUnix = yesterday.getTime()

      var thisweek = new Date(nowyear, nowmonth, nowday - nowweekday)
      var thisweekUnix = thisweek.getTime()

      var thismonth = new Date(nowyear, nowmonth)
      var thismonthUnix = thismonth.getTime()

      var pastweek = new Date(nowyear, nowmonth, (thisweek.getDate()-7))
      var pastweekUnix = pastweek.getTime()

      var pastmonth = new Date(nowyear, (nowmonth -1))
      var pastmonthUnix = pastmonth.getTime()

      // create array with date range objects
        $rootScope.dates = [
                          { id: 1, name: 'Today', start: todayUnix, end: nowUnix },
                          { id: 2, name: 'Yesterday', start: yesterdayUnix, end: todayUnix },
                          { id: 3, name: 'This Week', start: thisweekUnix, end: nowUnix},
                          { id: 4, name: 'Past Week', start: pastweekUnix, end: thisweekUnix},
                          { id: 5, name: 'This Month', start: thismonthUnix, end: nowUnix},
                          { id: 6, name: 'Past Month', start: pastmonthUnix, end: thismonthUnix },
                          { id: 7, name: 'Very Beginning', start:0, end: nowUnix }
                        ];

      } // end setDates()


}]); // controller end
