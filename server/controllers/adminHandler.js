import users from '../models/userDataStructure';
import loans from '../models/loanStructure';
import repayment from '../models/repaymentStructure';
import Validate from '../middlewares/validation';

class adminHandler {
  static getSpecificLoan(req, res) {
    const { id } = req.params;

    const loanDetails = loans.find(loan => loan.id === parseInt(id, 10));

    // Check if the loan exist
    if (loanDetails) {
      return res.status(200).send({
        status: 200,
        loanDetails: [loanDetails],
      });
    }
    return res.status(404).send({
      status: 404,
      error: 'There is no loan',
    });
  }

  static getCurrentLoans(req, res) {
    const { status, repaid } = req.query;
    if ((status !== undefined) && (repaid !== undefined)) {
      const filtered = loans.filter(
        loan => loan.status === status && loan.repaid === JSON.parse(repaid),
      );
      return res.status(200)
        .json({
          status: 200,
          data: filtered,
        });
    }
    return res.status(200)
      .json({
        status: 200,
        data: loans,
      });
  }

  static loanApprovals(req, res) {
    const { id } = req.params;
    const loanData = loans.find(loan => loan.id === parseInt(id, 10));
    // Check if loan to be approved exits
    if (!loanData) {
      return res.status(404)
        .send({
          status: 404,
          error: 'This loan does not exist',
        });
    }
    const userData = users.find(user => user.email === loanData.user);
    // Check if user with loan is verified
    if (userData.status === 'verified') {
      // Check status of loan
      if (loanData.status === 'approved') {
        return res.status(409)
          .send({
            status: 409,
            error: 'This loan has already been approved',
          });
      }
      // Do this if loan wasn't already approved
      loanData.status = req.body.status;
      const newLoanData = {
        loanId: loanData.id,
        loanAmount: loanData.amount,
        tenor: loanData.tenor,
        status: loanData.status,
        monthlyInstallments: loanData.monthlyInstallments,
      };
      // Return new loan details
      return res.status(200)
        .json({
          status: 200,
          data: newLoanData,
        });
    }
    return res.status(400)
      .send({
        status: 400,
        error: 'This user is not verified',
      });
  }

  static postRepayment(req, res) {
    const { error } = Validate.validateId(req.params.id);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
    }
    const { id } = req.params;
    const loan = loans.find(userLoan => userLoan.id === parseInt(id, 10));
    const paidAmount = parseInt(req.body.paidAmount, 10);


    if (loan) {
      if (loan.status === 'approved') {
        if (loan.balance <= paidAmount) {
          loan.balance -= paidAmount;
          const newLoanData = {
            id: repayment.length + 1,
            loanId: loan.id,
            createdOn: new Date(),
            amount: loan.amount,
            monthlyInstallments: loan.paymentInstallment,
            balance: loan.data,
          };
          repayment.push(newLoanData);
          return res.status(201)
            .json({
              status: 201,
              data: newLoanData,
            });
        }

        if (loan.balance > paidAmount) {
          return res.status(400)
            .send({
              status: 400,
              error: 'Amount paid is more than clients debt',
            });
        }

        if (loan.balance === paidAmount) {
          const newLoanData = {
            id: repayment.length + 1,
            loanId: loan.id,
            createdOn: new Date(),
            amount: loan.amount,
            monthlyInstallments: loan.paymentInstallment,
            balance: loan.data,
          };
          return res.status(201)
            .json({
              status: 201,
              message: 'Repayment is complete',
              data: newLoanData,
            });
        }
      }
      return res.status(400)
        .send({
          status: 400,
          error: 'This loan is not approved yet',
        });
    }
    return res.status(404)
      .send({
        status: 404,
        error: 'Loan does not exist',
      });
  }
}

module.exports = adminHandler;
