// Controller to edit bot database
angular.module('dashApp')
.controller('TrainbotCtrl', [
  '$rootScope',
  '$scope',
  'replyRef',
  '$mdDialog',
  '$firebaseObject',
  '$firebaseArray',
   function($rootScope, $scope, replyRef, $mdDialog, $firebaseObject, $firebaseArray){
     console.log('TrainbotCtrl loaded')

    var sample_question = "edit this question"

    $scope.watson = JSON.parse(window.sessionStorage.watson)

    $scope.current_classifierID = window.sessionStorage.classiferId

    // puts all the training data into a csv file
    window.downloadTrainingData = function() {

      // create training data to download in a CSV file
      var trainingArray = [];

      // loop through classifiers
      for(i = 0; i < $rootScope.classifiers.length; i++) {

        // get classifier name
        var classifierGroupName = $rootScope.classifiers[i].$id;

        // if classifier has questions
        if($rootScope.classifiers[i].questionsArray) {
          console.log(classifierGroupName)

          // get lenght of array
          var len = $rootScope.classifiers[i].questionsArray.length

          // check if length is smaller than 5 (Watson needs at leat 5 questions in order to create a classifier)
          if(len < 5){
            // skip to next classifier i
            continue
          }

          // check if length is 5 and one of the questions is sample question
          if(len === 5 && $rootScope.classifiers[i].questionsArray.indexOf(sample_question) !== -1){
            // skip to next classifier i
            continue
          }

          // looph through questions k of classifier i
          for(k = 0; k < len; k++) {
            // get text
            var text = $rootScope.classifiers[i].questionsArray[k];
            // check if question is sample question
            if(text === sample_question){
              // skip to next classifier i
              continue
            }
            // sanitize question
            var text_sanitized = $rootScope.sanitizeQuestion(text);
            // convert to csv
            var newText = text_sanitized.split(' ').join('%20')
            // push to training data and enclose row with double quotes
            trainingArray.push('"' + newText + '",' + classifierGroupName)
          }// end or(k = 0; k < len; k++)

        } // end if($rootScope.classifiers[i].questionsArray)
      }; // end for(i = 0; i < $rootScope.classifiers.length; i++)

      // create csv string from training data array
      var csvString = trainingArray.join("%0A");
      var a         = document.createElement('a');
      a.href        = 'data:attachment/csv,' + csvString;
      a.target      = '_blank';
      a.download    = 'trainingfile.csv';

      document.body.appendChild(a);
      a.click();

    }; // end window.downloadTrainingData

}]); // end trainbotCtrl
