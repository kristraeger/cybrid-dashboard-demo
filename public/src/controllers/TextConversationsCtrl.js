// Controller for conversations section of page

angular.module('dashApp')
.controller('TextConversationsCtrl', [
	'$rootScope',
   '$scope',
   'chatsRef',
   '$firebaseObject',
   '$firebaseArray',
   '$timeout',
   function($rootScope, $scope, chatsRef, $firebaseObject, $firebaseArray, $timeout ){
	   console.log("loading TextConversationsCtrl")

		 // =============== DEFINE DEFAULT VARIABLES FOR THIS SCOPE (can be customized to specific view)

		 // define array which should be used for search
		 $scope.searchArray = $rootScope.textArray

		 // set default flag to show untrained data
		 $scope.showUntrained = false;

		 // set default flag to show replied to data
		 $scope.showReplied = true;

		 // set default flag to show unreplied data
		 $scope.showExcellent = false;

		// set default date range
		$scope.selectedDate = { id: 7}

		// ======== THIS IS THE SAME FOR ALL CONTROLLERS (do not change)

		// define object properties for search
		$scope.searchObj = {
			array: $scope.searchArray,
			showUntrained: $scope.showUntrained,
			showReplied: $scope.showReplied,
			showExcellent: $scope.showExcellent,
			date: $scope.selectedDate
		}

	 // function to filter conversations
	 $scope.filterData = function(ev, status){
		 var el = ev.currentTarget || ev.srcElement
		 el = el.name

		 if(el === "showUntrained"){
			 $scope.showUntrained = !status
			 $scope.searchObj.showUntrained = $scope.showUntrained
		 } else if (el === "showReplied") {
			 $scope.showReplied = !status
			 $scope.searchObj.showReplied = $scope.showReplied
		 } else if (el === "showExcellent"){
			 $scope.showExcellent = !status
			 $scope.searchObj.showExcellent = $scope.showExcellent
		 }

		 $rootScope.search($scope.searchObj)
	 };

	 // function to update view when date is selected
	 $scope.dateSelected = function(dateObj){
		 // update searchObj
		 $scope.searchObj.date = dateObj
		 // trigger search
		 $rootScope.search($scope.searchObj)
	 }

	 // set dates when controller loads initially
	 $rootScope.setDates()

	 // variable to store which change happened to a conversation
	 var event;

	 // update search when chats are updated
	 $scope.$on('chats-updated', function(e) {

				 event = e.name

			 // call search function when chat array is updated
			 $rootScope.search($scope.searchObj)

	 });

}]); // controller end
