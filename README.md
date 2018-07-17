# Cybrid Dashboard - Demo

At Cybrid Industries, we build Cybrids, A.I. Sales Assistants using IBM Watson Natural Language Classifier. In order to track all conversations between the client's Cybrid and human prospects we needed an admin dashboard. In the web app you can:
filter conversations by geolocation
train the Cybrid on NEW questions, add NEW responses
train the Cybrid on new user input expressions to existing questions to increase confidence rate
assess overall performance (mark as 'excellent')

## Getting Started

Visit https://cybrid-dashboard-demo.herokuapp.com/
or
run locally
"scripts": {
    "start": "node server.js"
  }

login:
email:demo@cybridindustries.com
password: ilovecybrids

### Prerequisites

latest node

### Installing

npm install

## TODO

write tests
refactor search queries
refactor retrieving data
automate training for confidence > 96%
integrate with Watson API for automated training

## Built With

* Firebase
* Angular
* Node
