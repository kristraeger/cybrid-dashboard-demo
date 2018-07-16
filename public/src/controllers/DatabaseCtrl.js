// Controller to edit bot database
angular.module('dashApp')
.controller('DatabaseCtrl', [
  '$rootScope',
  '$scope',
  'replyRef',
  '$mdDialog',
  '$firebaseObject',
  '$firebaseArray',
   function($rootScope, $scope, replyRef, $mdDialog, $firebaseObject, $firebaseArray){
     console.log('DatabaseCtrl loaded')

     // TODO: dont create these objects, require user to add at least one question and one answer
     var editableArray = ['edit this question'];
     var editableAnswer = 'edit this answer';

     // set all input fields to disabled
    $scope.editGroupMode = false

    // edit classifier group
    $scope.editGroup = function(ev){
      console.log(ev)
      // TODO: enable input field of card that has been clicked
    }

    // creates new classifier group
    $scope.addNewGroupClassifier = function(ev, textInput) {
      // if name is not empty
      if(textInput) {
        // format group name
        var newgroup = textInput.toLowerCase()
        // if group does not exist yet
        if($rootScope.groups.indexOf(newgroup) === -1){
          // create new classifier obj
          newObj = {
            'answer' : editableAnswer,
            'group' : newgroup,
            'questionsArray' : editableArray
          };
          // push new object with auto child it to reply database
          replyRef().push(newObj, function(error){
            if(error){
              var errorMessage = 'Something went wrong while adding this group!'
              $rootScope.showAlert(errorMessage)
            } else {
              var confirm = $mdDialog.confirm()
                .clickOutsideToClose(true)
                .title('Edit "'+newgroup+'" now?')
                .textContent('You need to add at least 1 classifier, 1 answer and 5 questions to your new group.')
                .ok("Yeah, let's get this done right away!")
                .cancel("Later, I'm on my energy saving mode.");

                $mdDialog.show(confirm).then(function(ev){
                  //if user confims, open group modal
                  $scope.showGroup(ev, newgroup)
                }), function(){
                  // if not, close modal
                  //TODO:hight-light in group selection list
                  console.log("add group later")
                }
            }
          }); // end replyRef().push(newObj

          // empty input
          $scope.newClassifierGroupName = null;

          // if group exists already
        } else {
          var errorMessage = 'Group does exist already!'
          $rootScope.showAlert(errorMessage)
        }

      } else {
        var errorMessage = "Can't add empty group!"
        $rootScope.showAlert(errorMessage)
      }
    } // end $scope.addNewGroupClassifier

    // store $event when clicked on group card
    var click_ev

    // enable add group on enter
    var inputGroup = document.getElementById('inputNewClassifierGroupName')
    inputGroup.addEventListener('keydown', function(e){
        var click_ev = e
        $rootScope.runScript(e,$scope.addGroup)
    })

    // trigger add group fn from controller
    $scope.addGroup = function(){
      // use stored click event and grab input from modal
      $scope.addNewGroupClassifier(click_ev, $scope.newClassifierGroupName)
    }

    $scope.showGroup = function(ev, group) {
      // check if edit button was clicked instead
      if(ev.target.className.indexOf('edit-group-button') !== -1 ){
        // TODO: enable editing of group of clicked element
        // return to view
        return
      }

      console.log("showing group")
      $mdDialog.show({
        controller: GroupCtrl,
        templateUrl: './src/views/databasedialoglist.html',
        locals: {
          group: group,
          classifiers: $rootScope.classifiers
        },
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        onComplete: function(){
          $rootScope.$broadcast('show_group_complete')
        },
        fullscreen: true // Only for -xs, -sm breakpoints.
      })
      .then(function(answer) {
        console.log(answer)
      }, function() {
        console.log("group dialog cancelled")
      });
    };

    function GroupCtrl($scope, $mdDialog, group, replyRef, classifiers, $firebaseObject, $firebaseArray) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };

      // selected group
      $scope.group = group;

      // classifier array in firebase
      $scope.classifiers = classifiers;

      // variable to store location of currently selected item in database array
      var selectedIndex

      // set edit to null to lock icon displays when controller loaded
      $scope.edit = null
      $scope.editClassifier = null
      $scope.editAnswer = null

      // enable all button
      $scope.buttonclicked = false

      // detect which question in array is being edited
      $scope.selectedQuestionIndex = null

      // set first item to selected object when launching dialog
      for(var i = 0; i < classifiers.length; i ++){
        if(classifiers[i].group === group){

          $scope.selectedObj = classifiers[i]

          selectedIndex = i

          //separate group from classifier name
          var id = $scope.selectedObj.$id
          var id_length = $scope.selectedObj.$id.length

          // define input as part of id that is not group name
          $scope.inputClassifier = id.slice($scope.group.length,id_length)

          break
        }
      }

      // calling add Question from modal controller, otherwise it wont fire
      $scope.addQuestion = function(){
        classifier = $scope.group + $scope.inputClassifier
        $rootScope.addQuestion($scope.question, classifier)
      };

      // when question added to firebase
      $scope.$on('question_added', function(){
          // show saving status update
          if($scope.undoQuestion){
            $scope.statusQuestion = 'Aaaaaaand this question is back on file! Phew!';
            $scope.undoQuestion = null
          } else {
            $scope.statusQuestion = 'Awwyeah, the question has been added!';
          }

          // empty add question input
          $scope.question = null;

          // show new questions
          $scope.selectedObj = $scope.classifiers[selectedIndex]

          // update view
          $scope.$apply()
      });

      // function to create a new classifier name
      $scope.createClassifierName = function(){
        $scope.newClassifierName = $scope.group + $rootScope.toTitleCase($scope.newClassifierInput)
      }

      // fn to show details of selected classifier
      $scope.showClassifierDetails = function(index){

        // select object in classifier
        $scope.selectedObj = $rootScope.classifiers[index];

        // update index variable
        selectedIndex = index

        // set all status to null/empy
        $scope.clear()

        // set edit to false
        $scope.edit = false
        $scope.editClassifier = null
        $scope.editAnswer = null
        $scope.editQuestion = null

        //separate group from classifier name
        var id = $scope.selectedObj.$id
        var id_length = $scope.selectedObj.$id.length
        // define input as part of id that is not group name
        $scope.inputClassifier = id.slice($scope.group.length,id_length)

      }; // end $scope.showClassifierDetails

      //creates new classifier inside of list of classifiers for that group
      $scope.addClassifier = function(ev) {

        if(ev){
          ev.stopPropagation()
        }

        // clear all status
        $scope.clear()

        // if name is empty
        if(!$scope.newClassifierInput){
          var errorMessage = "Can't add empty name!"
          // show alert dialog
          $rootScope.showAlert(errorMessage)
          // return out of function
          return
        }

        // if name is same as group
        if($scope.newClassifierInput === $scope.group){
          var errorMessage = "Use a name different from group name!"
          // show alert dialog
          $rootScope.showAlert(errorMessage)
          // return out of function
          return
        }

        // get new classifier name
        var classifierNew = $scope.newClassifierName

        // create reference to database
        replyRef().child(classifierNew).once("value", function(data){

          // if classifier already exists
          if(data.val() != null){
            var errorMessage = "Classifier does already exist!"
            // show alert dialog
            $rootScope.showAlert(errorMessage)

            // return fn
            return
            // else if classifier does not exist yet
          } else {
            var newClassifierObject = {
                'answer' : editableAnswer,
                'group' : group,
                'questionsArray' : editableArray
            }

            // if new classifier object is valid/not empty
            if(newClassifierObject) {
              // add new classifier to firebase
              replyRef().child(classifierNew).set(newClassifierObject, function(error){
                // if error
                if (error) {
                  // show status message
                  $scope.statusClassifier = 'Oops, something went wrong while adding your new classifier!';
                  // update view
                  $scope.$apply()
                  // else if classifer has been added
                } else {
                  // get index for newly added classifier
                  var index = classifiers.$indexFor(classifierNew)
                  // set selected object to newly added classifier
                  $scope.showClassifierDetails(index)
                  // let user know
                  $scope.statusClassifier = 'You successfully added this new classifier!';
                  // update view
                  $scope.$apply()
                }
              }); // end replyRef().child(classifierNew).set

            } // end if if(newClassifierObject)
          }// else if( data.val() = null

        }) // end replyRef().child(classifierNew).once("value"

        // empty classifier input field
        $scope.newClassifierInput= null;

      } // end addClassifier

      $scope.updateEdit = function(type, index){
        // delete all status updates
        $scope.clear()

        // set new edit msg
        var msg = "[edit]"

        // set edit to true
        $scope.edit = true

        if(type === 'classifier'){
          $scope.editClassifier = msg
        }

        if(type === 'answer'){
          $scope.editAnswer = msg
        }

        if(type === 'question'){
          $scope.selectedQuestionIndex = index
          $scope.editQuestion = msg
        }
      }

      $scope.saveEdits = function(type, selectedObj, ev){
        console.log(selectedObj)

        if(ev){
        ev.stopPropagation()
        }

        // clear all status updates
        $scope.clear()

        // if edit is true
        if($scope.edit && $scope.group != undefined){
          console.log("saving edits")

          // disable button
          $scope.buttonclicked = true

          // create ref to not yet updated database
          replyRefSync = replyApp.database().ref()

          // create array with values from database
          syncArray = $firebaseArray(replyRefSync)

          // wait for array to be loaded
          syncArray.$loaded().then(function(data){

              // if item is classifier
              if(type === 'classifier' && $scope.editClassifier === '[edit]'){

                // get old classifier name as from database
                var classifierOld = data.$keyAt(selectedIndex)

                // if name is empty
                if(!$scope.inputClassifier){
                  var errorMessage = "Can't add empty name!"
                  // show alert dialog
                  $rootScope.showAlert(errorMessage)

                  // reset classifier name
                  $scope.selectedObj.$id = classifierOld

                  //separate group from classifier name
                  var id = $scope.selectedObj.$id
                  var id_length = $scope.selectedObj.$id.length
                  // define input as part of id that is not group name
                  $scope.inputClassifier = id.slice($scope.group.length,id_length)

                  // return out of function
                  return
                }

                // if name is same as group
                if($scope.inputClassifier === $scope.group){
                  var errorMessage = "use a name different from group name!"
                  // show alert dialog
                  $rootScope.showAlert(errorMessage)

                  // reset classifier name
                  $scope.selectedObj.$id = classifierOld

                  //separate group from classifier name
                  var id = $scope.selectedObj.$id
                  var id_length = $scope.selectedObj.$id.length
                  // define input as part of id that is not group name
                  $scope.inputClassifier = id.slice($scope.group.length,id_length)


                  // return out of function
                  return
                }

                // if new classifier not null
                if($scope.inputClassifier){

                  // get new classifier name
                  var classifierNew = $scope.group + $rootScope.toTitleCase($scope.inputClassifier)

                  // create reference to child that needs to be updated on database
                  var child = replyRefSync.child(classifierOld)

                  // get old child data
                  child.once('value', function(child_data) {

                    // check if classifier already exists

                    // if classifier already exists
                    if(classifierOld === classifierNew){
                      var errorMessage = "classifier does already exist!"
                      // show alert dialog
                      $rootScope.showAlert(errorMessage)

                      // return fn
                      return
                      // else if classifier does not exist yet
                    } else {

                      // set new child
                      replyRefSync.child(classifierNew).set(child_data.val());
                      // remove node with old classifier name
                      console.log("removing "+child)
                      child.remove()

                    }; // end else classifier already exists

                      // set edit status updates
                      $scope.edit = false
                      $scope.editClassifier = null

                      // update local array
                      $rootScope.classifiers = data
                      $scope.classifiers = data

                      // inform user
                      $scope.statusClassifier = "You successfully updated this classifier!";

                    }) // end child.once('value'

              } // end if($scope.inputClassifier)

              // else if type is answer and edit is true
            } else if (type === 'answer' && $scope.editAnswer === '[edit]'){

              // if answer is not null
              if(selectedObj.answer){

                // save new answer
                classifiers.$save(selectedObj)

                // set edit status updates
                $scope.edit = false
                $scope.editAnswer = null

                // inform user
                $scope.statusAnswer = "Wohoo, users will love this new answer!";

              } else {
                // show user error
                $scope.statusAnswer = "Can't save empty answer!";

                // reset answer
                $scope.selectedObj.answer = data[selectedIndex].answer

              } // end if(selectedObj.answer)

              // else if type is question and question is not empty
            } else if(type === 'question' && $scope.selectedObj.questionsArray[$scope.selectedQuestionIndex]){

              //save new question
              classifiers.$save(selectedObj)

              // set edit status updates
              $scope.edit = false
              $scope.editQuestion = null
              $scope.selectedQuestionIndex = null

              // inform user
              $scope.statusQuestion = "Question updated!"


            } // end if(type === 'question')

            // enable button again
            $scope.buttonclicked = false

          }) // end of oldArray.$loaded()

        } // end if ($scope.edit === "[edit]"
      } // end $scope.saveEdits

      // create confirmation dialog
      $scope.showConfirmDelete = function(ev, type, indexQuestion) {

        ev.stopPropagation();

        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm(
          {
            preserveScope: true,
            skipHide: true,
                                })
              .title('Would you like to delete this '+type+' ?')
              .textContent('Delete this '+type+' and all its related data entries.')
              .ariaLabel('confirm delete')
              .targetEvent(ev)
              .ok('Please do it!')
              .cancel('Nah, cancel');

        $mdDialog.show(confirm).then(function() {
          // delete object from firebase
          $scope.delete(type, indexQuestion)
          // else
        }, function() {
          // show cancel status to user
          if(type === 'classifier'){
            $scope.statusClassifier = 'You decided to keep this '+type;
            return
          }
          if(type === 'question'){
            $scope.statusQuestion = 'You decided to keep this '+type;
            return
          }


        });
      }; // end $scope.showConfirmDelete

      // fn to delete object from reply database
      $scope.delete = function(type, indexQuestion) {
        console.log("deleting "+type)

        // define object
        var classifier = $scope.group+$scope.inputClassifier

        // locate object in firebaseArray
        var index = $rootScope.classifiers.$indexFor(classifier)

        // store old object
        var objOld = $rootScope.classifiers.$getRecord(classifier)

        // create undo btn
        var undoBtn = document.createElement('a')
        undoBtn.setAttribute("href", "")
        undoBtn.setAttribute("id", "undoBtn")
        var text = document.createTextNode('Undo?')
        undoBtn.appendChild(text)

        // if item is question
        if(type === 'question'){

          // create ref to questions array on database
          var ref = replyApp.database().ref(classifier).child('questionsArray')

          // get old/local array
          var arrOld = objOld.questionsArray

          // remove item
          var itemRemoved = arrOld.splice(indexQuestion, 1)

          // save updated array back to firebase
          ref.set(arrOld)

          // clear out any other status messages
          $scope.clear()

          // show user confirmation
          $scope.statusQuestion = 'Roger that! Question has been deleted!';

          // show undo option
          document.getElementById('undoQuestion').appendChild(undoBtn)

          // enable undo function
          $scope.showUndo('question', objOld, itemRemoved[0])

        } else if(type === 'classifier'){

          // remove old classifier from array
          $rootScope.classifiers.$remove(index).then(function(){
            // clear out any other status messages
            $scope.clear()
            // show confirmation status
            $scope.statusClassifier = 'You decided to get rid of: '+classifier;
            // show undo option
            document.getElementById('undoClassifier').appendChild(undoBtn)
            // enable undo function
            $scope.showUndo('classifier', objOld)
            // empty form
            $scope.selectedObj = null
            $scope.inputClassifier = null
          }) // end $rootScope.classifiers.$remove

        } // end else f(type === 'classifier')

      } // end $scope.delete()

      $scope.showUndo = function(type, obj, removedQuestion){

        var restoreItem = {
          answer: obj.answer,
          group: obj.group,
          questionsArray: obj.questionsArray
        }

          // set event listener
          document.getElementById('undoBtn').addEventListener('click', function(){

            console.log("clicking")

            if(type=== 'question'){
              $rootScope.addQuestion(removedQuestion, obj.$id)
              $scope.undoQuestion = true
            }

            if(type === 'classifier'){

              // add new classifier to firebase
              replyRef().child(obj.$id).set(restoreItem, function(error){
                // if error
                if (error) {

                  if(type === 'classifier'){
                    // show status message
                    $scope.statusClassifier = 'Oops, something went wrong while restoring this classifier!';
                  }

                  // update view
                  $scope.$apply()

                  // else if classifer has been added
                } else {

                  // get index for restored classifier
                  var index = classifiers.$indexFor(obj.$id)

                  // set selected object to restored classifier
                  $scope.showClassifierDetails(index)

                  if(type === 'classifier'){
                    // let user know
                    $scope.statusClassifier = 'Good, you restored: '+obj.$id;
                  }

                  // update view
                  $scope.$apply()
                }

              }) // end replyRef().child(obj.$id).set()

            } // end if(type === 'classifier')

            // delete undoLink
            document.getElementById('undoBtn').remove()


          }) // end document.getElementById('undoBtn').addEventListener
        } // end $scope.showUndo()

      $scope.saveClassifier = function(){
        console.log("save classifier")
        $scope.saveEdits('classifier', $scope.selectedObj)
      }

      $scope.saveAnswer = function(){
        console.log("save answer")
        $scope.saveEdits('answer', $scope.selectedObj)
      }

      $scope.saveQuestion = function(){
        console.log("save question")
        $scope.saveEdits('question', $scope.selectedObj)
      }

      // after modal has finished loading
      $scope.$on('show_group_complete', function(){
        // enable save edits of classifier name on enter
        document.getElementById("inputClassifier").addEventListener('keydown', function(e){
          e.stopPropagation()
          if($scope.buttonclicked || !$scope.edit){
            return
          } else {
            $rootScope.runScript(e, $scope.saveClassifier)
          }
        })

        // enable save edits of answer on enter
        document.getElementById("inputAnswer").addEventListener('keydown', function(e){
          e.stopPropagation()
          if($scope.buttonclicked || !$scope.edit){
            return
          } else {
          $rootScope.runScript(e, $scope.saveAnswer)
          }
        })

        // enable save edits of questions on enter
        var parent = document.getElementById('questionsList')
        parent.addEventListener('keydown', function(e){
          if(e.target.className.indexOf('input-question') !== -1) {
            if($scope.buttonclicked || !$scope.edit){
              return
            } else {
            $rootScope.runScript(e, $scope.saveQuestion)
            }
          }
        })

        // enable add question on enter
        document.getElementById("newQuestion").addEventListener('keydown', function(e){
          e.stopPropagation()
          if($scope.buttonclicked){
            return
          } else {
          $rootScope.runScript(e, $scope.addQuestion)
          }
        })

        // enable add classifier on enter
        document.getElementById("newClassifierName").addEventListener('keydown', function(e){
          e.stopPropagation()
          if($scope.buttonclicked){
            return
          } else {
          $rootScope.runScript(e, $scope.addClassifier)
          }
        })

        // adjust group input field to actually input
        var els = document.getElementsByClassName('group-name')
        for(var i = 0 ; i < els.length ; i ++){
          els[i].style.width = ($scope.group.length +1)* 8 + 'px'
        }

      }) // end $scope.$on

      // function to clear all status updates
      $scope.clear = function(){
        $scope.statusQuestion='';
        $scope.statusClassifier='';
        $scope.statusAnswer='';

        // if remove link is present
        if(document.getElementById('undoBtn')){
          document.getElementById('undoBtn').remove()
        }

      }

    } // end GroupCtrl
}]); // end databaseCtrl
