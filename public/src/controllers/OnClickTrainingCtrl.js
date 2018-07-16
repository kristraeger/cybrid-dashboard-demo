// Controller for on click training dialog
angular.module('dashApp')
.controller('OnClickTrainingCtrl', [
  '$rootScope',
  '$scope',
  'replyRef',
  '$mdDialog',
  '$firebaseObject',
  '$firebaseArray',
  'message',
  'messagesIndex',
  'chatID',
   function($rootScope, $scope, replyRef, $mdDialog, $firebaseObject, $firebaseArray, message, messagesIndex, chatID){
     console.log('on click training ctrl loaded')

     // fn to close modal
     $scope.cancel = function() {
       // close modal
       $mdDialog.cancel();
       // TODO: emit close event
     };

     // set default to user question from chat
     $scope.question = message.message

     // create dropdown with classifier values
     $scope.items = $rootScope.classifiers

     // locate selected item in dropdown
     $scope.selectedIndex = $scope.items.$indexFor(message.classifier)

     // set default to given classifier from message object
     $scope.selectedItem = $scope.items.$keyAt($scope.selectedIndex);

     // enable search
     $scope.searchTerm;

     // create reference to messages in conversation database
     var messages  = $firebaseArray(chatApp.database().ref(chatID).child('messages'))

     function setTrainingStatus(chatID, status, messagesIndex) {
       console.log(messagesIndex)
       // if id is true
       if(chatID){

         // get id for message to be updated
         var key = messages.$keyAt(messagesIndex)

         // update message with new training status
         chatApp.database().ref(chatID).child('messages/'+key).update({
           trained: status
         })

         // go to prev selected item in conversations-list

       }
     }

     // indicate which classifier questions is added to
     $scope.getSelectedText = function() {
        if ($scope.selectedItem !== undefined) {
          return "Add to: " + $scope.selectedItem;
        } else {
          return "Please select a classifier";
        }
      };

      // calling add Question from modal controller, otherwise it wont fire
      $scope.addQuestion = function(question, classifier){
        $rootScope.addQuestion(question, classifier)
      };

      // when question added to firebase
      $scope.$on('question_added', function(){
        // close dialog
        $mdDialog.hide();

        // set training status of messages to true
        setTrainingStatus(chatID, true, messagesIndex)
      });

     //adds questions to classifier questionsArray for that particular classifier
    //  $scope.addQuestion = function(question, selectedItem) {
    //    // located selected item in classifier array
    //    var index = $scope.items.$indexFor(selectedItem)
     //
    //    // grab questionsArray for selected classifier
    //    var arr = $scope.items[index].questionsArray;
     //
    //    // create new question
    //    $scope.newQuestionValue = question.trim()
     //
    //    // if question is not empty
    //    if(question) {
     //
    //      // if question hasn't been added before
    //      if(arr.indexOf($scope.newQuestionValue) === -1){
     //
    //        // add question to existing question array
    //        arr.unshift($scope.newQuestionValue);
     //
    //        // update question array in firebase
    //        replyRef().child(selectedItem).update({
    //          questionsArray: arr
    //        })
     //
    //        // close dialog
    //        $mdDialog.hide();
     //
    //        // set training status of messages to true
    //        setTrainingStatus(chatID, true, messagesIndex)
     //
    //        // else alert user to rephrase question TODO: add a form validation instead of showing alert after
    //      } else {
     //
    //        // create error message
    //        var errorMessage =
    //        "Question has already been trained for selected classifier! " +
    //        "Try rephrasing it or pick a different classifier!"
     //
    //        // show error message
    //        $rootScope.showAlert(errorMessage)
     //
    //      } // end if(arr.indexOf)
    //    } // end if(question)
    //  } // end $scope.addQuestion

}]); // end controller
