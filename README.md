# QuickCredit
  Quick Credit is an online lending platform that provides short term soft loans to individuals. This
  helps solve problems of financial inclusion as a way to alleviate poverty and empower low
  income earners.
## Features
   + User (client) can sign up.
   + User (client) can login.
   + User (client) can request for only one loan at a time.
   + User (client) can view loan repayment history, to keep track of his/her liability or
    responsibilities.
   + Admin can mark a client as verified, after confirming his/her home and work address.
   + Admin can view a specific loan application.
   + Admin can approve or reject a client’s loan application.
   + Admin can post loan repayment transaction in favour of a client.
   + Admin can view all loan applications.
   + Admin can view all current loans (not fully repaid).
   + Admin can view all repaid loans.
## Development
   Quick Credit is built using the following technologies
   + Nodejs
   + Express
   + Mocha and Chai
   + Eslint
   + Babel
   + TravisCI
   + CodeClimate
## Installation
   1. Make sure you have a stable version of node installed
   2. Clone this repository [https://github.com/Omokay/QuickCredit.git](https://github.com/Omokay/QuickCredit.git)
   3. Go to the project directory `cd quickcredit`
   4. Install all the dependencies from your CLI using `npm install`
   5. Run the app using `npm start` server listens on port 4000 and use the postman collection to consume the API
   6. To perform tests use `npm test`
## Working API Routes
  | Action        | Request Type           | Endpoint  |
  | ------------- |:-------------:| -----:|
  |   User signup   |   POST    |  /api/v1/auth/signup  |
  |   User signin   |  POST     | /api/v1/auth/signin   |
  |   Mark user as verified   |  PATCH     | /api/v1/users/:email-id   |
  |   Get specific loans   | GET      | /api/v1/loans/:loan-id   |
  |   Get all current loans not fully repaid   |  GET     | /api/loans?status=approved&repaid=false   |
  |  Get all repaid loans    |  GET     | /api/v1/loans?status=approved&repaid=true   |
  |  Get all loans    |  GET     | /api/v1/loans   |
  |  Create a loan application    | POST      | /api/v1/loans   |
  |  View loan repayment history    |  GET     | /api/v1/loans/:loan-id/repayments   |
  |  Approve or reject a loan application    |  PATCH     | /api/v1/loans/:loan-id   |
  |  Post a loan repayment record    | POST      | /api/v1/loans/:loan-id/repayment   |

## Links
   + Project Homepage: [https://omokay.github.io/QuickCredit/](https://omokay.github.io/QuickCredit/)
   + Repository: [https://github.com/Omokay/QuickCredit](https://github.com/Omokay/QuickCredit)
   + Pivotal Tracker: [https://www.pivotaltracker.com/n/projects/2326579](https://www.pivotaltracker.com/n/projects/2326579)
## Api Documentation
   Swagger: [https://app.swaggerhub.com/apis/Omokay/Quick_Credit/1.0.0](https://app.swaggerhub.com/apis/Omokay/Quick_Credit/1.0.0)
## Licensing 
   Quick credit is under the MIT License
## Author
   Chuku Omoke David
