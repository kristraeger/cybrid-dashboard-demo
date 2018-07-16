// Controller for home section of page

angular.module('dashApp')
.controller('HomeCtrl', [
   '$scope',
   '$firebaseObject',
   '$firebaseArray',
   function($scope, $firebaseObject, $firebaseArray){
	   console.log("loading HomeCtrl")
	   
	   $scope.message = "Welcome to your Cybrid Dashboard! Get started here. "
	   
}]); // controller end

