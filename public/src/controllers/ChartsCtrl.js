// Controller for conversations section of page
angular.module('dashApp')
.controller('ChartsCtrl', [
  '$rootScope',
  '$scope',
  'chatsRef',
  '$firebaseObject',
  '$firebaseArray',
   function($rootScope, $scope, chatsRef, $firebaseObject, $firebaseArray){
	   console.log("loading ChartsCtrl")

     // track if scope is initializing
     var initializing = true
     // track what causes runFirebase to run
     var runFirebaseCallFrom
     // track if graph needs scope apply
     var applyCharts = false

     $scope.selected = [];
     $scope.limitOptions = [5, 10, 25, 50, 100, 200, 500];

      $scope.options = {
        rowSelection: true,
        multiSelect: true,
        autoSelect: true,
        decapitate: false,
        largeEditDialog: false,
        boundaryLinks: false,
        limitSelect: true,
        pageSelect: true
      };

      $scope.query = {
        order: 'name',
        limit: 5,
        page: 1
      };

     //auto-update chart based on which card user click
     var lineGraphArray = [];
     var graphColorArray = [];
     var seriesNameArray = [];
     var totalConvosArrayCountBool = true;
     var convoArrayIndex;
     var talkedToBobArrayCountBool = false;
     var talkedArrayIndex;
     var ctaSuccessArrayCountBool = false;
     var ctaArrayIndex;
     var userQuestionsArrayCountBool = false;
     var userQuestionIndex;
     var webArrayCountBool = false;
     var webArrayIndex;
     var textArrayCountBool = false;
     var textArrayIndex;

     //when card is clicked, data is displayed or removed from the graph
     $scope.check = function(event) {
       var dataID = $(event.currentTarget).attr("data-id");
       if (dataID == 'totalConvosArrayCount' && totalConvosArrayCountBool == false) {
          lineGraphArray.push(totalConvosArrayCount)
          graphColorArray.push('#4aa3df');
          seriesNameArray.push('Total Conversations');
          document.getElementById('totalChatsIcon').style.color = '#4aa3df';
          createChart(newchosenDateArray, lineGraphArray, graphColorArray, seriesNameArray)
          totalConvosArrayCountBool = true;
          convoArrayIndex = lineGraphArray.length - 1;
       } else if (dataID == 'totalConvosArrayCount' && totalConvosArrayCountBool == true){
         totalConvosArrayCountBool = false;
         document.getElementById('totalChatsIcon').style.color = '#757575';
         lineGraphArray.splice(convoArrayIndex, 1);
         graphColorArray.splice(convoArrayIndex, 1);
         seriesNameArray.splice(convoArrayIndex, 1);
       }
       if (dataID == 'talkedToBobArrayCount' && talkedToBobArrayCountBool == false) {
         lineGraphArray.push(talkedToBobArrayCount)
         graphColorArray.push('#df864a');
         seriesNameArray.push('Responded to Bob');
         document.getElementById('talkedToBobIcon').style.color = '#df864a';
         createChart(newchosenDateArray, lineGraphArray, graphColorArray, seriesNameArray)
         talkedToBobArrayCountBool = true;
         talkedArrayIndex = lineGraphArray.length - 1;
       } else if (dataID == 'talkedToBobArrayCount' && talkedToBobArrayCountBool == true) {
         talkedToBobArrayCountBool = false;
         document.getElementById('talkedToBobIcon').style.color = '#757575';
         lineGraphArray.splice(talkedArrayIndex, 1);
         graphColorArray.splice(talkedArrayIndex, 1);
         seriesNameArray.splice(talkedArrayIndex, 1);
       }
       if (dataID == 'ctaSuccessArrayCount' && ctaSuccessArrayCountBool == false) {
         lineGraphArray.push(ctaSuccessArrayCount)
         graphColorArray.push('#4adf86')
         seriesNameArray.push('Conversions');
         document.getElementById('ctaSuccessIcon').style.color = '#4adf86';
         createChart(newchosenDateArray, lineGraphArray, graphColorArray, seriesNameArray)
         ctaSuccessArrayCountBool = true;
         ctaArrayIndex = lineGraphArray.length - 1;
       } else if (dataID == 'ctaSuccessArrayCount' && ctaSuccessArrayCountBool == true){
         ctaSuccessArrayCountBool = false;
         document.getElementById('ctaSuccessIcon').style.color = '#757575';
         lineGraphArray.splice(ctaArrayIndex, 1);
         graphColorArray.splice(ctaArrayIndex, 1);
         seriesNameArray.splice(ctaArrayIndex, 1);
       }
       if (dataID == 'userQuestionsCount' && userQuestionsArrayCountBool == false) {
         lineGraphArray.push(userQuestionsArrayCount)
         graphColorArray.push('#864adf')
         seriesNameArray.push('user questions');
         document.getElementById('userQuestionsIcon').style.color = '#864adf';
         createChart(newchosenDateArray, lineGraphArray, graphColorArray, seriesNameArray)
         userQuestionsArrayCountBool = true;
         userQuestionIndex = lineGraphArray.length - 1;
       } else if (dataID == 'userQuestionsCount' && userQuestionsArrayCountBool == true){
         userQuestionsArrayCountBool = false;
         document.getElementById('userQuestionsIcon').style.color = '#757575';
         lineGraphArray.splice(userQuestionIndex, 1);
         graphColorArray.splice(userQuestionIndex, 1);
         seriesNameArray.splice(userQuestionIndex, 1);
       }
       if (dataID == 'webArrayCount' && webArrayCountBool == false) {
         lineGraphArray.push(webArrayCount)
         graphColorArray.push('#df4aa3')
         seriesNameArray.push('Web Conversation');
         document.getElementById('webChatsIcon').style.color = '#df4aa3';
         createChart(newchosenDateArray, lineGraphArray, graphColorArray, seriesNameArray)
         webArrayCountBool = true;
         webArrayIndex = lineGraphArray.length - 1;
       } else if (dataID == 'webArrayCount' && webArrayCountBool == true){
         webArrayCountBool = false;
         document.getElementById('webChatsIcon').style.color = '#757575';
         lineGraphArray.splice(webArrayIndex, 1);
         graphColorArray.splice(webArrayIndex, 1);
         seriesNameArray.splice(webArrayIndex, 1);
       }
       if (dataID == 'textArrayCount' && textArrayCountBool == false) {
         lineGraphArray.push(textArrayCount)
         graphColorArray.push('#dfd14a')
         seriesNameArray.push('Text Converstation');
         document.getElementById('textChatsIcon').style.color = '#dfd14a';
         createChart(newchosenDateArray, lineGraphArray, graphColorArray, seriesNameArray)
         textArrayCountBool = true;
         textArrayIndex = lineGraphArray.length - 1;
       } else if (dataID == 'textArrayCount' && textArrayCountBool == true){
         textArrayCountBool = false;
         document.getElementById('textChatsIcon').style.color = '#757575';
         lineGraphArray.splice(textArrayIndex, 1);
         graphColorArray.splice(textArrayIndex, 1);
         seriesNameArray.splice(textArrayIndex, 1);
       }
     }

     // Create new line chart based on date and chosen array
     function createChart(dateRange, chosenArray, colorArray, seriesArray) {
       $scope.labels = dateRange;
       $scope.series = seriesArray;
       $scope.data = chosenArray;
       $scope.onClick = function (points, evt) {
         console.log(points, evt);
       };
       $scope.datasetOverride = [
         {
           yAxisID: 'y-axis-1'
         },
         {
           yAxisID: 'y-axis-2'
         }
       ];
       $scope.colours = colorArray;
       $scope.options = {
         scales: {
           yAxes: [
             {
               id: 'y-axis-1',
               type: 'linear',
               display: true,
               position: 'left'
             },
             {
               id: 'y-axis-2',
               type: 'linear',
               display: true,
               position: 'right'
             }
           ]
         }
       };

       // update charts graph in view
       if(applyCharts){
         console.log("applying new scope to charts graph")
         $scope.$apply()
       }
     }; // end of createCharts()

    var start;
	  var end;

  	//Date-Picker code
  		$(function() {
  		    start = moment().subtract(29, 'days');
  		    end = moment();
  		    function cb(start, end) {
  		        $('#reportrange').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  						runFirebase(start, end)
  		    }

  		    $('#reportrange').daterangepicker({
  		        startDate: start,
  		        endDate: end,
  		        ranges: {
  		           'Today': [moment(), moment()],
  		           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  		           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  		           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  		           'This Month': [moment().startOf('month'), moment().endOf('month')],
  		           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  		        },
  						"alwaysShowCalendars": true
  		    }, cb);

  		    cb(start, end);
  		});

  	//Create firebase reference
  	//var ref = firebase.database().ref();
  	// weekdays and times posted
  	//% of confidence for each classifier

  	//basic convo variables
  	//tracks total conversations
    $scope.totalConvos = 0,
  	totalConvosArray = [],
  	totalConvosArrayCount = [],
  	//tracks user replies
  	$scope.talkedToBob = 0,
  	talkedToBobArray = [],
  	talkedToBobArrayCount = [],
  	//tracks conversions
  	$scope.ctaSuccess = 0,
  	ctaSuccessArray = [],
  	ctaSuccessArrayCount = [],
    //tracks total user messages
  	$scope.userQuestions = 0,
    userQuestionsArray = [],
  	userQuestionsArrayCount = [],

  	$scope.convRate = 0,
  	$scope.avgMsgPerConvo = 0,
  	//location variables
  	locationNames = [],
  	locationCount = [],
  	locationArray = [],
  	//classifier variables
  	classifierNames = [],
  	classifierCount = [],
    $scope.noReply= 0,
    $scope.classifierCount = 0;
  	classifierArray = [],
    $scope.classifierArray = [],
  	//Time variables
  	dateArray = [],
  	newchosenDateArray = [],
  	//tracks web traffic
  	$scope.webTotalConvos = 0,
  	webArray = [],
  	webArrayCount = [],
  	//tracks text traffic
  	$scope.textTotalConvos = 0,
  	textArray = [],
  	textArrayCount = [],
  	//used to match arrays of data with the date
  	count = 0,
  	totalCount = [];
    // var childData = $rootScope.chatArray;


  	function runFirebase(start, end) {
      runFirebaseCallFrom = arguments.callee.caller.name

  		chatsRef().on("value", function(snapshot) {
        //basic convo variables
    		//tracks total conversations
    		$scope.totalConvos = 0;
    		totalConvosArray = [];
    		totalConvosArrayCount = [];
    		//tracks user replies
    		$scope.talkedToBob = 0;
    		talkedToBobArray = [];
    		talkedToBobArrayCount = [];
    		//tracks conversions
    		$scope.ctaSuccess = 0;
    		ctaSuccessArray = [];
    		ctaSuccessArrayCount = [];
        //tracks total user messages
      	$scope.userQuestions = 0,
        userQuestionsArray = [],
      	userQuestionsArrayCount = [],

    		$scope.convRate = 0;
    		$scope.avgMsgPerConvo = 0;
    		//location variables
    		locationNames = [];
    		locationCount = [];
    		locationArray = [];
    		//classifier variables
    		classifierNames = [];
    		classifierCount = [];
        $scope.noReply = 0;
        $scope.classifierCount = 0;
    		classifierArray = [];
        $scope.classifierArray = [],
    		//Time variables
    		dateArray = [];
    		newchosenDateArray = [];
    		//tracks web traffic
    		$scope.webTotalConvos = 0;
    		webArray = [];
    		webArrayCount = [];
    		//tracks text traffic
    		$scope.textTotalConvos = 0;
    		textArray = [];
    		textArrayCount = []
    		//used to match arrays of data with the date
    		count = 0;
    		totalCount = [];
  				//Dives into the database to display all of the objects
  		    snapshot.forEach(function(childSnapshot) {
  		      // childData will be the actual contents of the child
  		      var childData = childSnapshot.val();
            if(childData.info && childData.info.createdAt) {
    					//make sure the the data being pulled is within the correct date range
    					if(childData.info.createdAt > Number(start) && childData.info.createdAt < Number(end)) {
    						//creates a new object containing the timestamp contained in the dateArray
    						var timestampDate = new Date( childData.info.createdAt );
    						var dateString = timestampDate.toLocaleDateString()
    						dateArray.push(dateString)

    						//Creates a web array and text array that matches the dateArray, used for line graphing the data
    						if(childData.info.type === "web") {
    							webArray.push(true)
    							textArray.push(false)
    						} else if(childData.info.type === "text") {
    							textArray.push(true)
    							webArray.push(false)
    						}

    						//add the total number of web and text conversations
    						if(childData.info.type === "web") {
    							$scope.webTotalConvos ++;
    						} else if(childData.info.type === "text") {
    							$scope.textTotalConvos ++;
    						}

    						//Counts and displays the total number of conversations
    						$scope.totalConvos = $scope.webTotalConvos + $scope.textTotalConvos;

    						//adds true into an array tracking all of the total conversations
    						totalConvosArray.push(true)

    						//Count the total number of interactions with Bob and push each into an array
                if(childData.messages) {
                  //make sure that they responded via text, 1 message sent in each text
      						if(childData.info.type == 'text' && Object.keys(childData.messages).length > 1) {
      							$scope.talkedToBob ++;
      							talkedToBobArray.push(true);
      						} else if(childData.info.type == 'web' && Object.keys(childData.messages).length > 2) {
                    //make sure that they responded via web, 2 messages sent in each live chat
                    $scope.talkedToBob ++;
      							talkedToBobArray.push(true);
                  } else if(childData.info.type == 'facebook') {
                    $scope.talkedToBob ++;
      							talkedToBobArray.push(true);
                  }
                } else {
                  talkedToBobArray.push(false);
                }

    						if(childData.info.CTAsuccess) {
    							$scope.ctaSuccess ++;
    							ctaSuccessArray.push(true)
    						} else {
    							ctaSuccessArray.push(false)
    						}

    						//adds the total number of replies from user
    						if(childData.info.classifierArray) {
    							$scope.userQuestions = $scope.userQuestions + childData.info.classifierArray.length;
                  userQuestionsArray.push(true)
    						} else {
                  userQuestionsArray.push(false)
                }

    						//creates parallel arrays of classifiers and count of each
    						var classifierArray = childData.info.classifierArray;
    						createCountListsFromArray(classifierArray, classifierNames, classifierCount);

    						//create parallel arrays of location and count of each
    						var customerState = childData.info.customerState;
    						createCountLists(customerState, locationNames, locationCount);

    					} // end if(childData.info.createdAt > ...)
            }
          }) // end snapshot.forEach(function(childSnapshot)

  				//Creates an array of all the dates between 2 dates, will be used to chart on a line graph
  				for(i = 0; i < dateArray.length; i++) {
  					var oldDate;
  					if(dateArray[i] != oldDate) {
  						newchosenDateArray.push(dateArray[i])
  						oldDate = dateArray[i];
  					}
  				}

  				//create an array of all users for each date, which matches up with the newchosenDateArray, so they can be sorted and charted on a line graph
  				var oldDate = dateArray[0];
  				for(i = 0; i < dateArray.length; i++) {
  					if(i== dateArray.length-1) {
  						count ++;
  			    	totalCount.push(count)
  			    } else if(dateArray[i] == oldDate) {
  						count ++;
  					} else if (dateArray[i] != oldDate) {
  						totalCount.push(count)
  						count = 1;
  						oldDate = dateArray[i];
  					}
  				}

  				//Plug in the second parameter into the graph to display the data by date
  				createArrayToDisplayInLineGraph(webArray, webArrayCount)
  				createArrayToDisplayInLineGraph(textArray, textArrayCount)
          createArrayToDisplayInLineGraph(userQuestionsArray, userQuestionsArrayCount)
  				createArrayToDisplayInLineGraph(totalConvosArray, totalConvosArrayCount)
  				createArrayToDisplayInLineGraph(talkedToBobArray, talkedToBobArrayCount)
  				createArrayToDisplayInLineGraph(ctaSuccessArray, ctaSuccessArrayCount)

  				//Create a new object of each location and store it in an array which can be sorted later
  				createArrayOfObjectsFromArrays(locationArray, locationNames, locationCount);

  				locationArray.sort(function(a, b){
  				    return b.count-a.count
  				})

  				//Create a new object of each classifier and store it in an array which can be sorted later
  				createArrayOfObjectsFromArrays(classifierArray, classifierNames, classifierCount);

          $scope.classifierArray = classifierArray;

          $scope.classifierCount = classifierCount.length;

  				//sort classifiers/locations descending
  				classifierArray.sort(function(a, b){
  				    return b.count-a.count
  				})

  				//calculates average messages the user sends per conversation
  				$scope.avgMsgPerConvo = ($scope.userQuestions/$scope.talkedToBob).toFixed(2);

  				//calculates the conversion rate in percentages
  				$scope.convRate = (($scope.ctaSuccess/$scope.talkedToBob)*100).toFixed(2);

          console.log("initial data load:" +initializing)
          // if runFirebase has been called from datepicker
          if(runFirebaseCallFrom === "cb"){
            // if initalizing is true
              if(initializing){
                // set it to false
                initializing = false
                // else start digest circle
              } else {
                console.log("applying new scope to charts view")
                $scope.$apply()
                applyCharts = true
              }
          }

          document.getElementById('totalChatsIcon').style.color = '#4aa3df';
          lineGraphArray = [totalConvosArrayCount];
          graphColorArray = ['#4aa3df'];
          seriesNameArray = ['Total Conversations']

          //create a new chart
          createChart(newchosenDateArray, lineGraphArray, graphColorArray, seriesNameArray)

  		});//end of ref.on


  			//adds to arrays the total locations value's by name and count
  			function createCountLists(property, arrayOne, arrayTwo) {
  				if(property){
  					if(arrayOne.indexOf(property) === -1){
  						arrayOne.push(property)
  						arrayTwo.push(1)
  					} else {
  						var index = arrayOne.indexOf(property)
  						var count = arrayTwo[index]
  						arrayTwo[index] = count + 1
  					}
  				}
  			}

  			//adds to arrays the total classifer's by name and values attached
  			function createCountListsFromArray(property, arrayOne, arrayTwo) {
  				if(property){
  					for(i = 0; i < property.length; i ++) {
              //remove noReply from the displayed classifier data
  						if(arrayOne.indexOf(property[i]) === -1 && property[i].includes("NoReply")){
                $scope.noReply = $scope.noReply + 1;
  						}else if(arrayOne.indexOf(property[i]) === -1){
  							arrayOne.push(property[i])
  							arrayTwo.push(1)
  						} else {
  							var index = arrayOne.indexOf(property[i])
  							var count = arrayTwo[index]
  							arrayTwo[index] = count + 1
  						}
  					}
  				}
  			}

  			//sort two arrays into a new object contained within an array, which can be sorted easier
  			function createArrayOfObjectsFromArrays(newArray, arrayOne, arrayTwo) {
  				for(i = 0; i < arrayOne.length; i++) {
  					var locationObject = new Object();
  					locationObject.name = arrayOne[i];
  					locationObject.count = arrayTwo[i];
  					newArray.push(locationObject);
  				}
  			}

  			//creates an array which can be displayed in a line graph displaying the dates
  			function createArrayToDisplayInLineGraph(slicedArray, graphedArray) {
  				for(i = 0; i < newchosenDateArray.length; i++) {
  					var amount = totalCount[i];
  					var totalAmount = 0;
  					var graphArray = slicedArray.slice(0,amount);
  					slicedArray.splice(0,amount);
  					for(j = 0; j < graphArray.length; j++) {
  						if(j == graphArray.length - 1) {
  							totalAmount ++;
  							graphedArray.push(totalAmount)
  						} else if(graphArray[j] == true) {
  							totalAmount ++;
  						}
  					}
  				}
  			}



  	//end of the runFirebase function
  	}

    //Download data button variables and functions
    var asUtf16, downloadExcelCsv, makeExcelCsvBlob, rows, toTsv;
     asUtf16 = function(str) {
       var buffer, bufferView, i, j, ref, val;
       buffer = new ArrayBuffer(str.length * 2);
       bufferView = new Uint16Array(buffer);
       bufferView[0] = 0xfeff;
       for (i = j = 0, ref = str.length; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
         val = str.charCodeAt(i);
         bufferView[i + 1] = val;
       }
       return bufferView;
     };

     makeExcelCsvBlob = function(rows) {
       return new Blob([asUtf16(toTsv(rows)).buffer], {
         type: "text/csv;charset=UTF-16"
       });
     };

     toTsv = function(rows) {
       var escapeValue;
       escapeValue = function(val) {
         if (typeof val === 'string') {
           return '"' + val.replace(/"/g, '""') + '"';
         } else if (val != null) {
           return val;
         } else {
           return '';
         }
       };
       return rows.map(function(row) {
         return row.map(escapeValue).join('\t');
       }).join('\n') + '\n';
     };

     downloadExcelCsv = function(rows, attachmentFilename) {
       var a, blob;
       blob = makeExcelCsvBlob(rows);
       a = document.createElement('a');
       a.style.display = 'none';
       a.download = attachmentFilename;
       document.body.appendChild(a);
       a.href = URL.createObjectURL(blob);
       a.click();
       URL.revokeObjectURL(a.href);
       a.remove();
     };
     var rows;
     window.exampleDownload = function() {
       rows = [newchosenDateArray, totalConvosArrayCount, talkedToBobArrayCount, ctaSuccessArrayCount, userQuestionsArrayCount, webArrayCount, textArrayCount];
       newchosenDateArray.unshift('Date')
       totalConvosArrayCount.unshift('total conversations')
       talkedToBobArrayCount.unshift('total customer engagement')
       ctaSuccessArrayCount.unshift('total conversions')
       userQuestionsArrayCount.unshift('total user messages')
       webArrayCount.unshift('total web conversations')
       textArrayCount.unshift('total text conversions')
       return downloadExcelCsv(rows, 'exported-data.csv');
     };
     //end of download data button0

     runFirebase(start, end)
}]); // controller end
