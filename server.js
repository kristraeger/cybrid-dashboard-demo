var watson    = require('watson-developer-cloud');
var fs        = require('fs');
var express   = require('express');
var app = express();
var http      = require('http');
var firebase  = require('firebase');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


 app.use(express.static(__dirname + '/public'));


// SERVER ==================================================================
var server = http.Server(app);
var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
server.listen(port, function () {
    console.log('Server running on port: %d', port);
});

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// FRONTEND ROUTES =========================================================
// render website
app.get('*', function(req, res) {
       res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// var natural_language_classifier = watson.natural_language_classifier({
//   username: '{username}',
//   password: '{password}',
//   version: 'v1'
// });
//
// var params = {
//   language: 'en',
//   name: 'My Classifier',
//   training_data: fs.createReadStream('./train.csv')
// };
//
// natural_language_classifier.create(params, function(err, response) {
//   if (err)
//     console.log(err);
//   else
//     console.log(JSON.stringify(response, null, 2));
// });
