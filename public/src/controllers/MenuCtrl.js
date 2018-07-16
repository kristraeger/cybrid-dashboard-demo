angular.module('dashApp')
    .controller('MenuCtrl', function ($rootScope, $scope, $mdSidenav, menuService) {

      console.log('MenuCtrl');

      // display app TODO: add a delay for a smoother transition
      document.getElementById('user-signed-in').className = 'active';

      $scope.botName = window.sessionStorage.getItem('botName')
      console.log($scope.botName)

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

});
