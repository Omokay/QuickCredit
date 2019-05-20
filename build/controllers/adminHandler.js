"use strict";

var _userDataStructure = _interopRequireDefault(require("../models/userDataStructure"));

var _loanStructure = _interopRequireDefault(require("../models/loanStructure"));

var _repaymentStructure = _interopRequireDefault(require("../models/repaymentStructure"));

var _validation = _interopRequireDefault(require("../middlewares/validation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var adminHandler =
/*#__PURE__*/
function () {
  function adminHandler() {
    _classCallCheck(this, adminHandler);
  }

  _createClass(adminHandler, null, [{
    key: "getSpecificLoan",
    value: function getSpecificLoan(req, res) {
      var id = req.params.id;

      var loanDetails = _loanStructure["default"].find(function (loan) {
        return loan.id === parseInt(id, 10);
      }); // Check if the loan exist


      if (loanDetails) {
        return res.status(200).send({
          status: 200,
          data: [loanDetails]
        });
      }

      return res.status(404).send({
        status: 404,
        error: 'There is no loan'
      });
    }
  }, {
    key: "getCurrentLoans",
    value: function getCurrentLoans(req, res) {
      var _req$query = req.query,
          status = _req$query.status,
          repaid = _req$query.repaid;

      if (status !== undefined && repaid !== undefined) {
        var filtered = _loanStructure["default"].filter(function (loan) {
          return loan.status === status && loan.repaid === JSON.parse(repaid);
        });

        return res.status(200).json({
          status: 200,
          data: filtered
        });
      }

      return res.status(200).json({
        status: 200,
        data: _loanStructure["default"]
      });
    }
  }, {
    key: "loanApprovals",
    value: function loanApprovals(req, res) {
      var id = req.params.id;

      var loanData = _loanStructure["default"].find(function (loan) {
        return loan.id === parseInt(id, 10);
      }); // Check if loan to be approved exits


      if (!loanData) {
        return res.status(404).send({
          status: 404,
          error: 'This loan does not exist'
        });
      }

      var userData = _userDataStructure["default"].find(function (user) {
        return user.email === loanData.user;
      }); // Check if user with loan is verified


      if (userData.status === 'verified') {
        // Check status of loan
        if (loanData.status === 'approved') {
          return res.status(409).send({
            status: 409,
            error: 'This loan has already been approved'
          });
        } // Do this if loan wasn't already approved


        loanData.status = req.body.status;
        var newLoanData = {
          loanId: loanData.id,
          loanAmount: loanData.amount,
          tenor: loanData.tenor,
          status: loanData.status,
          monthlyInstallments: loanData.monthlyInstallments
        }; // Return new loan details

        return res.status(200).json({
          status: 200,
          data: newLoanData
        });
      }

      return res.status(400).send({
        status: 400,
        error: 'This user is not verified'
      });
    }
  }, {
    key: "postRepayment",
    value: function postRepayment(req, res) {
      var _Validate$validateId = _validation["default"].validateId(req.params.id),
          error = _Validate$validateId.error;

      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message
        });
      }

      var id = req.params.id;

      var loan = _loanStructure["default"].find(function (userLoan) {
        return userLoan.id === parseInt(id, 10);
      });

      var paidAmount = parseInt(req.body.paidAmount, 10);

      if (loan) {
        if (loan.status === 'approved') {
          if (loan.balance <= paidAmount) {
            loan.balance -= paidAmount;
            var newLoanData = {
              id: _repaymentStructure["default"].length + 1,
              loanId: loan.id,
              createdOn: new Date(),
              amount: loan.amount,
              monthlyInstallments: loan.paymentInstallment,
              balance: loan.data
            };

            _repaymentStructure["default"].push(newLoanData);

            return res.status(201).json({
              status: 201,
              data: newLoanData
            });
          }

          if (loan.balance > paidAmount) {
            return res.status(400).send({
              status: 400,
              error: 'Amount paid is more than clients debt'
            });
          }

          if (loan.balance === paidAmount) {
            var _newLoanData = {
              id: _repaymentStructure["default"].length + 1,
              loanId: loan.id,
              createdOn: new Date(),
              amount: loan.amount,
              monthlyInstallments: loan.paymentInstallment,
              balance: loan.data
            };
            return res.status(201).json({
              status: 201,
              message: 'Repayment is complete',
              data: _newLoanData
            });
          }
        }

        return res.status(400).send({
          status: 400,
          error: 'This loan is not approved yet'
        });
      }

      return res.status(404).send({
        status: 404,
        error: 'Loan does not exist'
      });
    }
  }]);

  return adminHandler;
}();

module.exports = adminHandler;