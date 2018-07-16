// Main Controller for dashApp

angular.module('dashApp')
.controller('MainCtrl', [
   '$rootScope',
   '$scope',
   'chatsRef',
   'replyRef',
   '$firebaseObject',
   '$firebaseArray',
   '$mdSidenav',
   'menuService',
   '$mdDialog',
   '$location',
   '$timeout',
   function($rootScope, $scope, chatsRef, replyRef, $firebaseObject, $firebaseArray, $mdSidenav, menuService, $mdDialog, $location, $timeout){
       console.log("loading MainCtrl");


      if($rootScope.currentUser = null){
        console.log($rootScope.currentUser)
        document.location.href = '/';
      }

      document.getElementById('loading').className = 'stage active';

	   	// ===== RETRIEVE DATA FROM DATABASE
	   	// create sync object using the reference we get using chatRef factory
		 var obj = $firebaseArray(chatsRef())

		 // default state of data download from database
		 var initialDataLoaded = false

		 // variable to store child from database
		 var chat

		 // initialize variable to store all chats
		 $rootScope.chatArray = []

	   // store all texts chats
	   $rootScope.textArray = []

	   // store all web chats
	   $rootScope.webArray = []

     // store all facebook chate
     $rootScope.facebookArray = []

		 chatsRef().on('child_added', function(snapshot) {
			 if(!initialDataLoaded){
				 return
			 }
			 else if (initialDataLoaded) {
			    // do something here
				 $rootScope.$broadcast('chats-updated');
			  }
			});

		 chatsRef().on('child_changed', function(snapshot) {
			 if(!initialDataLoaded){
				 return
			 }
			 else if (initialDataLoaded) {
			    // do something here
				 $rootScope.$broadcast('chats-updated');
			  }
			});

		 chatsRef().on('child_removed', function(snapshot) {
			 if(!initialDataLoaded){
				 return
			 }
			 else if (initialDataLoaded) {
			    // do something here
				 $rootScope.$broadcast('chats-updated');
			  }
			});

		 // this will fire once when data is initially loaded
		 chatsRef().once('value', function(snapshot) {
			  // set initial download state to true
			  initialDataLoaded = true;
        console.log("initial data load complete")
        $rootScope.$broadcast('data:loaded');
        // hide loading screen
        document.getElementById('loading').style.display = 'none';
        document.getElementById('loading').className = 'stage not-active';
        // show main view
        document.getElementById('loaded').className = 'active';

			  // create new empty array
			  $rootScope.chatArray = [];

        var split
        var count = 0

			  $rootScope.chatArray = obj.$loaded().then(function(data){

				  $rootScope.chatArray = data

			      	// iterate thru data
			     	angular.forEach(data, function(value, key) {

              if(value.info != undefined){

                if(value.info.createdAt != undefined){

    			     		if(value.info.type != undefined){

    			     			// if item is text
    				     		if(value.info.type === "text"){

    					     		// add chat obj to beginning of chatArray
    					     		$rootScope.textArray.push(value)
    				     		} else if (value.info.type === "web"){
                      // if item is web
                        // add chat obj to beginning of chatArray
                        $rootScope.webArray.push(value)
                    } else if(value.info.type === "facebook"){
                      // if item is facebook
                        // add chat obj to beginning of chatArray
                        $rootScope.facebookArray.push(value)
                    } // end if(value.info.type != undefined)
    			     		} else {
                    console.log("type undefined: "+value.$id)
                    // obj.$remove(key)
                  }
                } else {
                  console.log("no createdAt for: "+value.$id)
                  // obj.$remove(key)

                }// end if(value.info.createdAt != undefined)

                // delete all chats with test classifier
                // if(value.info.classifierArray){
                //   var str = value.info.classifierArray.toString()
                //
                //   if(str.indexOf('cedricTest') !== -1){
                //     console.log("test classifier: "+value.$id)
                //     obj.$remove(key)
                //   }
                //
                //   if(str.indexOf('bobbotTest') !== -1){
                //     console.log("test classifier: "+value.$id)
                //     obj.$remove(key)
                //   }
                //
                //
                //   Object.entries(value.info.classifierArray).forEach(([prop, val]) => {
                //     if(val === 'bobbotTest' || val === 'cedricTest' ){
                //         console.log("test classifier: "+value.$id)
                //         obj.$remove(key)
                //       }
                //     }
                //   );
                //
                // }

                // delete all convo from RU + DE
                // if(value.info.customerCountry){
                //   if(value.info.customerCountry === "RU"){
                //     console.log("RU: "+value.$id)
                //     obj.$remove(key)
                //   }
                //
                //   if(value.info.customerCountry === "DE"){
                //     console.log("DE: "+value.$id)
                //     obj.$remove(key)
                //   }
                // }

                // delete all conversation with kristina, matts, sams phone number
                // if(value.info.customerNumber){
                //   if(value.info.customerNumber === "4158197002"){
                //     console.log("KT text: "+value.$id)
                //     obj.$remove(key)
                //   }
                //
                //   if(value.info.customerNumber === "9258763287"){
                //     console.log("Matt text: "+value.$id)
                //     obj.$remove(key)
                //   }
                //
                //   if(value.info.customerNumber === "4155301557"){
                //     console.log("Sam text: "+value.$id)
                //     obj.$remove(key)
                //   }
                //   if(value.info.customerNumber === "4155278862"){
                //     console.log("Sam text: "+value.$id)
                //     obj.$remove(key)
                //   }
                //
                // }


              } else {
                // check for db entries without info
                console.log("no info for: " + value.$id)
                // obj.$remove(key)
              }// end if(value.info != undefined)
			     	}) // end angular.forEach(data, function(value, key)
			  }) // end obj.$loaded().then(function(data)
		  }); // end chatsRef().once('value', function(snapshot)

      // ===== LOGIN

      // show alerts when error occurs during login
      $rootScope.showAlert = function(errorMessage) {
      // Appending dialog to document.body to cover sidenav in docs app
      // Modal dialogs should fully cover application
      // to prevent interaction outside of dialog
        $mdDialog.show(
          $mdDialog.alert({
            preserveScope: true,
            skipHide: true,
          })
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Ooops!')
            .textContent(errorMessage)
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
        );
      };

      $rootScope.runScript = function(e, cb) {
          if (e.which == 13 || e.keyCode == 13) {
              cb()
              return false;
          }
      }

      // ============== LOADING CSS
      if(initialDataLoaded === false){
          console.log("not loaded")
          // show loading screen
          document.getElementById('loading').className = 'stage active';
          // hide main view
          document.getElementById('loaded').className = 'not-active';
        } else {
          document.getElementById('loaded').className = 'active';
          document.getElementById('loading').className = 'not-active';
      }

      // ============== MODIFY DATA AND SAVE TO DATABASE

      // function to indicate whether a conversations has been used for training (ideally all flags are true)
      $rootScope.setTrainedFlag = function(id){

        var obj = $firebaseArray(chatsRef()).$loaded().then(function(data){
          // find index for associated record in sync array from firebase
          var i = data.$indexFor(id)

          // if record exists
          if (i !== -1){
            // set status to either true/false
            data[i].info.trained = !data[i].info.trained

            // update item and save back to database
            data.$save(i).then(function(){
              console.log("training flag has been set to: "+ data[i].info.trained)
            })
          } else {
            console.log("could not find record in array to update training status")
          }
        })

      } // .- end setTrainedFlag

      // function to indicate whether a conversation was excellent (100% correct)
      $rootScope.setExcellentFlag = function(id){

        // if id is true
        if(id){

          // create reference to chat info
          var info  = chatApp.database().ref(id).child('info')

          // get current excellent status
          var excellent = $rootScope.selectedObj.info.excellent

          // update excellent to either true or false
          info.update({
            excellent: !excellent
          })

          console.log("set excellent to: "+ !excellent)
        }

      } // .- end setExcellentFlag

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

      // =============== SEARCH CHAT ARRAY TO DISPLAY IN CONVERSATIONS VIEW

      // function to sanitize input from search field
     $rootScope.sanitizePhone = function(targetNum){
     // remove everything but digits(0-9) and then strip out anything before last 10 digits
     return targetNum.replace (/[^\d]/g, "").replace (/^.*(\d{23})$/, "$1");
     };

      // function to apply search filters to an array and create dynamic items available for DOM
      $rootScope.search = function(search, query) {
          console.log("searching...")

          // define which chat array should be used for search
          var chatArray = search.array

          // get query, if any
          var queryTerm = query

          // get filter status: untrained
          var untrained = search.showUntrained

          // get filter status: replied
          var replied = search.showReplied

          // get filter status: excellent
          var excellent = search.showExcellent

          // get date range start date
          var start = parseInt(search.date.start)

          // get date range end date
          var end = parseInt(search.date.end)

          // create array to store new array with filtered results
          var resultsArray = [];

            // loop through chat array and push results to new array
            for(var i = 0; i < chatArray.length; i++){

              var item = chatArray[i]
              // console.log("finding search results...")

                // if item does not have info properties
                if(item.info == undefined ){
                  continue // skip to next item in chat array
                }

                // apply date range:

                // get item date
                var itemDate = parseInt(item.info.createdAt)

                if (itemDate < start) {
                  continue// skip to next item in chat array
                }

                if (itemDate >= end) {
                  continue // skip to next item in chat array
                }

                // apply search filters:

                // trained
                // if item does not match trained/untrained filter, skip to next item in chat array
                  if (untrained === true) {
                    if (item.info.trained === true){
                      continue // skip to next item in chat array
                    }
                  }

                // replied
                // if item does not match replied filter, skip to next item in chat array
                if (replied === true) {
                  var type = typeof item.info.lastReplyUTC
                  if (type !== "number"){
                    continue // skip to next item in chat array
                  }
                }

                // excellent
                // if item does not match excellent filter, slipt to next item in chat array
                if (excellent === true) {
                  // check if excellent status exists
                  if(item.info.excellent){
                    // if status is set to false
                    if(item.info.excellent === false){
                      continue // skip to next item in chat array
                    }
                  } else {
                    continue // skip to next item in chat array
                  }
                }

              // if no input in search field
              if(!queryTerm) {
                // push item to beginning of result array
                resultsArray.unshift(item)

              // else if user is using search field
              // apply search terms:
              } else {
                // sanitize query term and split it into array of strings
                var queryArray = [];
                queryArray = queryTerm.toString().toLowerCase().split(" ");
                console.log(queryArray)

                // variable to store amount of times item property matches search term
                var matchCount = 0;

                // loop through array of search terms and find matches for item
                for(var j = 0; j < queryArray.length; j ++){
                    // sanitize input (only leaves numbers)
                    var num = $rootScope.sanitizePhone(queryArray[j])

                    // if input is a number
                    if(num.length > 0){
                      // sanitize item id (which also consists of phone number if there is any)
                      var id = $rootScope.sanitizePhone(item.$id)

                        if(id.indexOf(num) !== -1){
                          console.log("found matching item " +item.$id )
                          matchCount += 1
                          continue
                        }

                    // otherwise search for matches in string properties
                    } else {

                        // check if search term is type web or text
                        if (item.info.type != undefined) {
                          if(item.info.type.toLowerCase().indexOf(queryArray[j]) !== -1){
                            matchCount += 1
                            continue
                                }
                        }

                             // check if search term is direction inbound or outbound
                        if (item.info.direction != undefined) {
                                if(item.info.direction.toLowerCase().indexOf(queryArray[j]) !== -1){
                                  matchCount += 1
                                  continue
                                }
                        }

                              // check if search term is country
                        if (item.info.customerCountry != undefined) {
                                if(item.info.customerCountry.toLowerCase().indexOf(queryArray[j]) !== -1){
                                  matchCount += 1
                                  continue
                                }
                        }

                              // check if search term is city
                        if (item.info.customerCity != undefined) {
                                if(item.info.customerCity.toLowerCase().indexOf(queryArray[j]) !== -1){
                                  matchCount += 1
                                  continue
                                }
                        }

                              // check if search term is state
                        if (item.info.customerState != undefined) {
                                if(item.info.customerState.toLowerCase().indexOf(queryArray[j]) !== -1){
                                  matchCount += 1
                                  continue
                                }

                            }

                        // check if search term matches a classifier of the item
                        if(item.info.classifierArray != undefined){

                          // variable to store if a match has been found
                          var found = false;

                          // loop through classifier array of item
                          for(var k = 0; k < item.info.classifierArray.length; k++){
                            // if a classifier contains the same string of the search term
                            if(item.info.classifierArray[k].toLowerCase().indexOf(queryArray[j]) !== -1) {
                              // increase match count
                              matchCount += 1
                              // set found flag to true
                              found = true
                              // break out of classifier loop
                              break
                            }

                          } // .- end for loop classifierArray

                          // if found is true after completing for loop, skip to next iteration of outer loop
                          if (found){
                            continue
                          }
                        }

                    } // .- end else

                    // if match count is smaller than index after one iteration of query term loop, stop function for this item
                    // all search terms must be found
                    if (matchCount < j){
                      break
                    }

                  }// end for(var i = 0; i < queryArray.length; i ++)

                  // push item to result array if item matches all search terms
                if(matchCount == queryArray.length){
                    resultsArray.unshift(item)
                  }

                } // end else !queryTerm

             };	// end for loop chatArray

            // load items for scroll view
            var DynamicItems = function() {
                 /**
                  * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
                  */
                 this.loadedPages = {};

                 /** @type {number} Total number of items. */
                 this.numItems = 0;

                 /** @const {number} Number of items to fetch per request. */
                 this.PAGE_SIZE = 50;

                 this.fetchNumItems_();
               };

                 // Required.
                 DynamicItems.prototype.getItemAtIndex = function(index) {
                   var pageNumber = Math.floor(index / this.PAGE_SIZE);
                   var page = this.loadedPages[pageNumber];

                   if (page) {
                       return page[index % this.PAGE_SIZE];
                     } else if (page !== null) {
                       this.fetchPage_(pageNumber);
                     }
                   };

                 // Required.
                 DynamicItems.prototype.getLength = function() {
                   return this.numItems;
                 };

                 DynamicItems.prototype.fetchPage_ = function(pageNumber) {
                   // Set the page to null so we know it is already being fetched.
                   this.loadedPages[pageNumber] = null;

                   $timeout(angular.noop, 0).then(angular.bind(this, function() {
                     this.loadedPages[pageNumber] = [];
                     var pageOffset = pageNumber * this.PAGE_SIZE;
                     for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
                       this.loadedPages[pageNumber].push(resultsArray[i]);
                     }
                   }));

                 };

                 DynamicItems.prototype.fetchNumItems_ = function() {
                   $timeout(angular.noop, 0).then(angular.bind(this, function() {
                     this.numItems = resultsArray.length;
                   }));

                 };

                 // make items available for DOM
                $rootScope.dynamicItems = new DynamicItems();

                if(event !== "chats-updated"){
                  if($rootScope.chatIndex){
                    $rootScope.selectedObj = resultsArray[$rootScope.chatIndex]
                  } else {
                    $rootScope.selectedObj = resultsArray[0];
                  }
                }

                // function to show content of selected item
                $rootScope.showContent = function($index){
                  // save index for re-focus after question has ben trained
                  $rootScope.chatIndex = $index

                  // set view to selected object
                  $rootScope.selectedObj = resultsArray[$index];

                  console.log("chat selected:")
                  console.log($rootScope.selectedObj)
               };

      }; // .-end search()

      // =============== TRAINING DATABASE

      // get all existing classifiers from database
      $rootScope.classifiers = $firebaseArray(replyRef())

      //Contains each group
      $rootScope.groups = [];

     // Retrieve new posts as they are added to our database
     replyRef().on("child_added", function(snapshot, prevChildKey) {
       var newPost = snapshot.val();

       //puts each new groupo into an array
       if ($rootScope.groups.indexOf(newPost.group) > -1) {

       } else {
           $rootScope.groups.push(newPost.group);
       }
     });

      // in conversation view, user can add question to train classifier on database
      $rootScope.onClickTraining = function(ev, message, index, chatID) {

        // open dialog
        $mdDialog.show({
          controller: 'OnClickTrainingCtrl',
          templateUrl: './src/views/onclicktraining.html',
          locals: {
            message: message,
            chatID: chatID,
            messagesIndex: index,
            $rootScope: $rootScope
          },
          parent: angular.element(document.getElementsByTagName('message')[0]),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: false
        })
        .then(function() {
          console.log("closed")
          // refocus view to conversation closed
          $rootScope.showContent($rootScope.chatIndex)
        }, function() {
          console.log("cancelled")
          var el = angular.element(document.querySelectorAll('button.onclick-training-btn')[index])
          el.css('color', '#4aa3df')
        });

      };

      // add a new question to reply data base
      $rootScope.addQuestion = function(question, classifier){

        // if user question is not empty
        if(question){

          // locate selected classifier in classifier array
          var index = $rootScope.classifiers.$indexFor(classifier)

          // get questionsArray for selected classifier
          var arr = $rootScope.classifiers[index].questionsArray;

          // sanitize question
          var questionNew = $rootScope.sanitizeQuestion(question)

          // if question is below word limit
          if(questionNew.split(' ').length > 60){
            var errorMessage = 'Question can\'t have more than 60 words!'
            $rootScope.showAlert(errorMessage)
            return
          }

            // if question hasn't been added before
            if(arr.indexOf(questionNew) === -1){

                // add question to existing question array
                arr.unshift(questionNew);

                // update question array in firebase
                replyRef().child(classifier).update({
                  questionsArray: arr
                }).then(function(error){
                  if(error){
                    var errorMessage = "Question could not be added!"
                    $rootScope.showAlert(errorMessage)
                  } else {
                    $rootScope.$broadcast('question_added')
                  }
                })

              // else alert user to rephrase question TODO: add a form validation instead of showing alert after
              } else {

                // create error message
                var errorMessage =
                "Question has already been added to selected classifier! " +
                "Try rephrasing it or pick a different classifier!"

                // show error message
                $rootScope.showAlert(errorMessage)

              } // end if(arr.indexOf)

            } else {

              // create error message
              var errorMessage = "Can't add empty question!"

              // show Alert
              $rootScope.showAlert(errorMessage)

          } // end if(question)

      }// end $rootScope.addQuestion

      // ======== UTILITIES

      // function to capitalize every word in string and remove all whitespaces
      $rootScope.toTitleCase = function(str){
          var toTitle = str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          var joined = toTitle.replace(/ /g, '')
          return joined
      };

      // function to sanitize question before creating training data
      $rootScope.sanitizeQuestion = function(str){
        // remove all double white spaces and trim question
        var str_trim = str.replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
        // replace multiple double quotes with double quotes
        var str_removequotes = str_trim.replace(/""/g,'"');
        // put double quotes around double quotes
        var str_quotes = str_removequotes.replace(/"/g,'""');
        return str_quotes
      };

}]); // controller end
