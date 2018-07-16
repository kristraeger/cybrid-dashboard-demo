angular.module('dashApp').controller('LoginCtrl', function ($rootScope, $scope, $mdDialog, $location, $firebaseArray) {
    console.log('LoginCtrl');

    $scope.email = 'demo@cybridindustries.com';
    $scope.pass = 'ilovecybrids';
    $scope.botsToSelect = []; //List of available bots
    $scope.userLoggedIn = false; //isUser logged in?
    $scope.botSelected = null // has bot been selected yet?

    // Keep track of the currently signed in user.
    $rootScope.currentUser = null;

    var config_login = {
        apiKey: "AIzaSyDjL9NtTg9Q_rSh7kHH6xy3ejzVl8wonM8",
        authDomain: "cedric-main.firebaseapp.com",
        databaseURL: "https://cedric-main.firebaseio.com",
        storageBucket: "cedric-main.appspot.com",
        messagingSenderId: "1070359583853"
    };

    var loginApp = firebase.initializeApp(config_login);

    $rootScope.handleSignedInUser = function(user) {
      console.log("user signed in")
      $rootScope.currentUser = user
      // Save data to sessionStorage
      window.sessionStorage.setItem('currentUserID', user.uid);
      // // display app TODO: add a delay for a smoother transition
      // hide sign out view
      document.getElementById('user-signed-out').style.display = 'none';

      document.getElementById('select-bot').style.display = 'block';
      // show log out button
      document.getElementById('btnLogout').className = 'md-button';
      // enable logout
      document.getElementById('btnLogout').addEventListener('click', function() {
        console.log("logging out")
        // trigger sign out function
        firebase.auth().signOut().then(function() {
          console.log('Signed Out');
          // change url
          window.location.href = '/login.html';
          //broad cast event
          $rootScope.broadcast('user:logOut', {})
          // show logged out view
          $scope.handleSignedOutUser();
          // empty email input
          document.getElementById('txtEmail').value = "";
          // empty password input
          document.getElementById('txtPassword').value = "";
        }, function(error) {
          console.error('Sign Out Error', error);
        });
      });
      // show bot select
      document.getElementById('select-bot').style.display = 'block';

    } // end of signedIn User

    $rootScope.handleSignedOutUser = function(){
      console.log("user signed out")
      $rootScope.currentUser = null
      window.sessionStorage.clear();
      $scope.userLoggedIn = false
      $scope.botSelected = null
      $scope.botsToSelect = [];
      // show sign out
      document.getElementById('user-signed-out').style.display = 'block';
      // hide bot select (view doesnt update but apply is still running)
      document.getElementById('select-bot').style.display = 'none';
      // hide log out button
      document.getElementById('btnLogout').className = 'hide';
      // add event listener to login button
      document.getElementById('btnLogin').addEventListener('click', function() {
        $scope.login()
      }); //end of addEventListener
      // log in when hit enter after any input field
      var inputfields = document.getElementsByClassName('login-input')
      for(var i = 0; i < inputfields.length; i++){
        inputfields[i].addEventListener('keydown', function(e){
          $rootScope.runScript(e, $scope.login)
        })
      }
    } // end $scope.handleSignedOutUser

    if(!$scope.userLoggedIn){
      $rootScope.handleSignedOutUser()
    } // end if(!$scope.userLoggedIn)

    $scope.selectBot = function(bot) {
        console.log('Selected', bot);
        window.sessionStorage.setItem('botName', bot.friendlyName);

        loginApp.database().ref('/configs/' + bot.compName).once('value').then(function (data) {
            const conf = data.val();
            window.sessionStorage.setItem('config_chat', JSON.stringify(conf.config_chat));
            window.sessionStorage.setItem('config_reply', JSON.stringify(conf.config_reply));
            window.sessionStorage.setItem('watson', JSON.stringify(conf.watson));
            window.sessionStorage.setItem('classiferId', conf.classiferId);

            $rootScope.$emit('user:logIn', []);
            document.location.href = '/#/home';
        });

        $rootScope.botSelected = true;

    };

    // login function
    $scope.login = function(){
        firebase.auth().signInWithEmailAndPassword($scope.email, $scope.pass).then(function (res) {
            //get available bots
            const uid = res.uid;
            // show log in view and set user var
            $rootScope.handleSignedInUser(res)
            //Who am i? Admin or just owner of base?
            firebase.Promise.all([
                loginApp.database().ref('/admins/' + uid).once('value'),
                loginApp.database().ref('/owners/' + uid).once('value')
            ]).then(function (results) {
                const isAdmin = results[0].exists();
                var availableBotsArray = results[1].exists() ?  Object.keys(results[1].val()) : [];
                console.log(availableBotsArray)

                if (!isAdmin && !availableBotsArray.length) {
                    throw new Exception('Access denied');
                }

                // display bots in DOM
                function showBotsForSelect(bots)
                {
                    $scope.userLoggedIn = true;
                    $scope.botsToSelect = [];
                    for(var i = 0; i < bots.length; i++){
                      $scope.botsToSelect.push(bots[i])
                    }
                    console.log($scope.botsToSelect)
                    $scope.$digest();

                }

                // get friendly names of bots that are available to user
                function getBotNames(bots)
                {
                  var botsWithNamesArray = [];
                  var count = -1;

                  for(var i = 0; i < bots.length; i++){
                    loginApp.database().ref('/configs/'+bots[i]).child('friendlyName').once('value').then(function(names){

                      // update count
                      count ++

                      // create bot object
                      var botWithName = {
                        compName : bots[count],
                        friendlyName : names.val()
                      }

                      // push new bot object to appropriate array
                      botsWithNamesArray.push(botWithName)

                      // if as many names are available as bots
                      if(botsWithNamesArray.length === bots.length){
                        showBotsForSelect(botsWithNamesArray);
                      }

                    }); // end loginApp.database().ref('/configs/'+availableBotsArray[i]
                  };

                }

                if (isAdmin) {
                    loginApp.database().ref('/configs/').once('value').then(function(data){

                        // get all available bots
                        availableBotsArray = Object.keys(data.val());

                        // get all names of all bots that are available
                        getBotNames(availableBotsArray)

                    }); // end loginApp.database().ref('/configs/')
                } // end if (isAdmin)
                else {
                    getBotNames(availableBotsArray);
                }


            }).catch(function (err) {
                console.log('You have no access', err);
                var errorMessage = 'This is VIP area B) Ask your admin for access!'
                $rootScope.showAlert(errorMessage)
            });

        }).
        catch(function(error) {
            // error handling
            var errorCode = error.code;
            // message to display to user
            var errorMessage;
            // get the correct error message depending on the error code
            if(errorCode === "auth/invalid-email"){
                console.log("invalid email")
                errorMessage = "This email doesn't seem to work. Typo? "
            } else if(errorCode === "auth/email-already-in-use"){
                console.log("There is an existing account with this email address!")
                errorMessage = "There is an existing account with this email address!"
            } else if(errorCode === "auth/wrong-password"){
                console.log("email and password do not match our records")
                errorMessage = "Email/password combination does not match our records. Try again!"
            } else {
                console.log(errorCode)
                errorMessage = error.message;
            }
            // trigger alert modal when hit login
            $rootScope.showAlert(errorMessage)

            return;
        });
    }; // end of login()

    // show alerts when error occurs during login
    $rootScope.showAlert = function(errorMessage) {
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

}); // end LoginCtrl
