"use strict";

var _express = _interopRequireDefault(require("express"));

var _adminHandler = _interopRequireDefault(require("../controllers/adminHandler"));

var _userHandler = _interopRequireDefault(require("../controllers/userHandler"));

var _auth = _interopRequireDefault(require("../authentication/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.get('/', function (req, res) {
  return res.status(200).send({
    status: 200,
    message: 'tst Welcome to Quick Credit'
  });
}); // Make post requests to signup API Endpoints

router.post('/auth/signup', _userHandler["default"].signupHandler); // Make post requests to signin API Endpoints

router.post('/auth/signin', _userHandler["default"].signinHandler); // Make post request to verify user

router.patch('/users/:email/verify', _auth["default"].adminAuthorize, _userHandler["default"].getVerified); // Admin Get specific loan

router.get('/loans/:id', _auth["default"].adminAuthorize, _adminHandler["default"].getSpecificLoan);
/** This route will handle admin getting all loan and
 *  Admin getting current loans in the case where query params {status:approved & repaid:false}
 * (GET /loans?status=approved&repaid=false)
 *  Also repaid loans in the case where {status:approved & repaid:true} is passed as query params
 * (GET /loans?status=approved&repaid=true)
 */

router.get('/loans', _auth["default"].adminAuthorize, _adminHandler["default"].getCurrentLoans); // Make post requests to apply loan API Endpoint

router.post('/loans', _auth["default"].userAuthorize, _userHandler["default"].applyLoan); // Get request to user repayment loan history

router.get('/loans/:loanId/repayments', _auth["default"].userAuthorize, _userHandler["default"].getRepaymentLoans); // Admin approve or reject loan

router.patch('/loans/:id', _auth["default"].adminAuthorize, _adminHandler["default"].loanApprovals); // Admin post repayment transaction in favor or client

router.post('/loans/:loanId/repayment', _auth["default"].adminAuthorize, _adminHandler["default"].postRepayment);
module.exports = router;