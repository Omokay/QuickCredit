"use strict";

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Validation =
/*#__PURE__*/
function () {
  function Validation() {
    _classCallCheck(this, Validation);
  }

  _createClass(Validation, null, [{
    key: "signupValidation",
    // validate for user signup
    value: function signupValidation(info) {
      var schema = {
        email: _joi["default"].string().email().trim().lowercase().required(),
        firstName: _joi["default"].string().min(3).required(),
        lastName: _joi["default"].string().min(3).required(),
        password: _joi["default"].string().min(7).max(30).required(),
        address: _joi["default"].string().min(10).required()
      };
      return _joi["default"].validate(info, schema);
    }
  }, {
    key: "signinValidation",
    value: function signinValidation(info) {
      var schema = {
        email: _joi["default"].string().email().trim().lowercase().required(),
        password: _joi["default"].string().required()
      };
      return _joi["default"].validate(info, schema);
    }
  }, {
    key: "validateUserVerify",
    value: function validateUserVerify(info) {
      var schema = {
        email: _joi["default"].string().email().required()
      };
      return _joi["default"].validate(info, schema);
    }
  }, {
    key: "validateCreateLoan",
    value: function validateCreateLoan(info) {
      var schema = {
        firstName: _joi["default"].string().min(3).max(30).required(),
        lastName: _joi["default"].string().min(3).max(30).required(),
        email: _joi["default"].string().email().lowercase().required(),
        tenor: _joi["default"].number().min(1).max(12).required(),
        amount: _joi["default"].number().min(10000).max(1000000).required()
      };
      return _joi["default"].validate(info, schema);
    }
  }, {
    key: "validateLoanApprovals",
    value: function validateLoanApprovals(info) {
      var schema = {
        email: _joi["default"].string().email().required(),
        status: _joi["default"].string().valid('approved', 'rejected').required()
      };
      return _joi["default"].validate(info, schema);
    }
  }, {
    key: "validateId",
    value: function validateId(info) {
      var schema = {
        loanId: _joi["default"].number().required()
      };
      return _joi["default"].validate(info, schema);
    }
  }]);

  return Validation;
}();

module.exports = Validation;