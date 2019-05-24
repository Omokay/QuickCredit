// import users from '../models/userDataStructure';
// import loans from '../models/loanStructure';
// import repayment from '../models/repaymentStructure';
import Validate from '../middlewares/validation';
import info from '../models/migrations/userQueries';
import loans from '../models/migrations/loanQueries';
import repaymentData from '../models/migrations/repaymentQueries';

class adminHandler {
  static async getsingleLoans(req, res) {
    const id = parseInt(req.params.id, 10);
    const singleLoan = await loans.getLoanById(id);

    if (!singleLoan) {
      return res.status(500).json({
        error: 'Something went wrong',
      });
    }

    if (singleLoan.rows.length === 0) {
      return res.status(404).send({
        error: 'This loan does not exist',
      });
    }

    return res.status(200).send({
      data: singleLoan.rows[0],
    });
  }

  static async getCurrentLoans(req, res) {
    const { status } = req.query;
    let repaid = req.query;

    if (status && repaid) {
      repaid = JSON.parse(repaid);
      const queriedLoans = await loans.getQueriedLoans(status, repaid);

      if (!queriedLoans) {
        return res.status(500).json({
          error: 'Request canceled',
        });
      }

      if (queriedLoans.rows.length === 0) {
        return res.status(200).send({
          message: 'Data does not exist',
        });
      }
      return res.status(200).send({
        data: queriedLoans.rows,
      });
    }

    const allLoans = await loans.getAllLoans();

    if (!allLoans) {
      return res.status(500).json({
        error: 'Request canceled',
      });
    }

    if (allLoans.rows.length === 0) {
      return res.status(200).send({
        message: 'No loans available',
      });
    }

    return res.status(200).send({
      data: allLoans.rows,
    });
  }

  static loanApprovals(req, res) {
    const { id } = req.params;
    const loanData = loans.getLoanById(id);
    // Check if loan to be approved exits
    if (!loanData) {
      return res.status(404)
        .send({
          status: 404,
          error: 'This loan does not exist',
        });
    }
    const userData = info.getUserById(id);
    // Check if user with loan is verified
    if (userData.rows[0].status === 'verified') {
      // Check status of loan
      if (loanData.rows[0].status === 'approved') {
        return res.status(409)
          .send({
            status: 409,
            error: 'This loan has already been approved',
          });
      }
      // Do this if loan wasn't already approved
      loanData.rows[0].status = req.body.status;
      const newLoanData = {
        loanid: loanData.rows[0].id,
        loanamount: loanData.rows[0].amount,
        tenor: loanData.rows[0].tenor,
        status: loanData.status,
        monthlyinstallments: loanData.rows[0].monthlyInstallments,
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

  static async postRepayment(req, res) {
    const { error } = Validate.validateId(req.params.id);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
    }
    const { id } = req.params;
    const paidAmount = parseInt(req.body.paidAmount, 10);
    const loan = loans.getsingleLoans(id);

    if (loan) {
      if (loan.rows[0].status === 'approved') {
        if (loan.rows[0].balance <= paidAmount) {
          loan.rows[0].balance -= paidAmount;
          const newLoanData = {
            id: loan.rows.length + 1,
            loanid: loan.rows[0].id,
            createdOn: new Date(),
            amount: loan.rows[0].amount,
            monthlyinstallments: loan.rows[0].paymentinstallment,
            balance: loan.rows[0].data,
          };

          await repaymentData.postLoans(id, loan.rows[0].amount);
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

        if (loan.rows[0].balance === paidAmount) {
          const newLoanData = {
            id: loan.length + 1,
            loanid: loan.id,
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
