# Cybrid Dashboard - Demo

In 2017, I ran a b2b startup called Cybrid Industries.
At Cybrid Industries, we built Cybrids - A.I. Sales Assistants using IBM Watson Natural Language Classifier. Our Cybrids would live on our client's website, slack, facebook or phone.
In order to track all conversations between the client's Cybrid and their human prospects, we needed an admin dashboard.
In the Cybrid Dashboard you can:
* filter conversations by geolocation & conversation type (web, sms, facebook)
* train the Cybrid on NEW questions, add NEW responses
* train the Cybrid on new user input expressions to existing questions to increase confidence rate
* assess overall performance (mark as 'excellent')

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
