"use strict";

var _userDataStructure = _interopRequireDefault(require("../models/userDataStructure"));

var _loanStructure = _interopRequireDefault(require("../models/loanStructure"));

var _repaymentStructure = _interopRequireDefault(require("../models/repaymentStructure"));

var _validation = _interopRequireDefault(require("../middlewares/validation"));

var _auth = _interopRequireDefault(require("../authentication/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var userHandler =
/*#__PURE__*/
function () {
  function userHandler() {
    _classCallCheck(this, userHandler);
  }

  _createClass(userHandler, null, [{
    key: "signupHandler",
    value: function signupHandler(req, res) {
      var _Validate$signupValid = _validation["default"].signupValidation(req.body),
          error = _Validate$signupValid.error;

      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message
        });
      }

      var _req$body = req.body,
          email = _req$body.email,
          firstName = _req$body.firstName,
          lastName = _req$body.lastName,
          password = _req$body.password,
          address = _req$body.address; // check if new user email is already in use

      var createuser = _userDataStructure["default"].find(function (user) {
        return user.email === email;
      });

      if (createuser) {
        return res.status(409).json({
          status: 409,
          error: 'This email is already taken'
        });
      } // Initialise status and user type (client or admin) for new user


      var status = 'unverified';
      var isAdmin = false;
      var id = _userDataStructure["default"].length + 1; // Generate token for new user

      var token = _auth["default"].generateToken({
        id: id,
        email: email,
        status: status,
        isAdmin: isAdmin
      });

      var userDetails = {
        token: token,
        id: id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: _auth["default"].hashPassword(password),
        address: address,
        status: status,
        isAdmin: isAdmin
      };

      _userDataStructure["default"].push(userDetails);

      return res.status(201).json({
        status: 201,
        data: {
          token: token,
          id: id,
          email: email,
          firstName: firstName,
          lastName: lastName,
          address: address,
          status: status,
          isAdmin: isAdmin
        }
      });
    }
  }, {
    key: "signinHandler",
    value: function signinHandler(req, res) {
      var _req$body2 = req.body,
          email = _req$body2.email,
          password = _req$body2.password; // validate inputs for user signin

      var _Validate$signinValid = _validation["default"].signinValidation(req.body),
          error = _Validate$signinValid.error;

      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message
        });
      } // Check if email is in userStructure


      var user = _userDataStructure["default"].find(function (useremail) {
        return useremail.email === email;
      });

      if (user) {
        var id = user.id,
            firstName = user.firstName,
            lastName = user.lastName,
            isAdmin = user.isAdmin;

        var checkPass = _auth["default"].checkPassword(password, user.password);

        if (checkPass) {
          var token = _auth["default"].generateToken({
            id: id,
            email: email,
            isAdmin: isAdmin
          });

          return res.status(200).json({
            message: 'You have logged in successfully',
            status: 200,
            data: {
              token: token,
              id: id,
              email: user.email,
              firstName: firstName,
              lastName: lastName,
              isAdmin: isAdmin
            }
          });
        }
      }

      return res.status(400).json({
        status: 400,
        error: 'Incorrect email or password'
      });
    } // Apply for new loan

  }, {
    key: "applyLoan",
    value: function applyLoan(req, res) {
      var _req$body3 = req.body,
          email = _req$body3.email,
          amount = _req$body3.amount,
          tenor = _req$body3.tenor;

      var _Validate$validateCre = _validation["default"].validateCreateLoan(req.body),
          error = _Validate$validateCre.error;

      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message
        });
      } // Check if user has an open loan already


      if (_loanStructure["default"].find(function (loan) {
        return loan.user === email;
      })) {
        return res.status(409).json({
          status: 409,
          error: 'You cannot apply at this time'
        });
      }

      var loanId = _loanStructure["default"].length + 1;
      var interest = 0.05 * amount;
      var paymentInstallment = (amount + interest) / tenor;
      var balance = amount - 0;
      var loanInfo = {
        id: loanId,
        user: email,
        createdOn: new Date(),
        status: 'pending',
        repaid: false,
        tenor: tenor,
        amount: amount,
        paymentInstallment: paymentInstallment,
        balance: balance,
        interest: interest
      };

      _loanStructure["default"].push(loanInfo);

      return res.send({
        status: 201,
        data: loanInfo
      });
    } // Mark a user as verified

  }, {
    key: "getVerified",
    value: function getVerified(req, res) {
      // Mark a user as verified
      var _Validate$validateUse = _validation["default"].validateUserVerify(req.params),
          error = _Validate$validateUse.error;

      if (error) {
        res.status(400).send({
          status: 400,
          error: error.details[0].message
        });
      } else {
        var email = req.params.email; // Check if the index of such user exits

        var user = _userDataStructure["default"].find(function (userEmail) {
          return userEmail.email === email;
        });

        if (user) {
          user.status = 'verified';
          res.status(200).json({
            status: 200,
            data: {
              token: user.token,
              id: user.id,
              email: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              address: user.address,
              status: user.status,
              isAdmin: user.isAdmin
            }
          });
        } else {
          res.status(404).json({
            status: 404,
            error: 'Email does not exist'
          });
        }
      }
    } // User get repayment loans

  }, {
    key: "getRepaymentLoans",
    value: function getRepaymentLoans(req, res) {
      var id = req.params.id;

      var _Validate$validateId = _validation["default"].validateId(req.params.id),
          error = _Validate$validateId.error;

      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message
        });
      }

      var repayment = _repaymentStructure["default"].find(function (repLoan) {
        return repLoan.loanId === parseInt(id, 10);
      });

      if (repayment) {
        return res.status(200).json({
          status: 200,
          data: repayment
        });
      }

      return res.status(404).json({
        status: 404,
        error: 'Repayment not found'
      });
    }
  }]);

  return userHandler;
}();

module.exports = userHandler;