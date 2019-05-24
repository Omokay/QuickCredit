import pool from './dbConnect';


class loanData {
  static async applyLoan(info) {
    try {
      const queryText = `INSERT INTO loans(
    email,"firstName","lastName", status, tenor,amount,balance,interest, "paymentInstallment", repaid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`;
      const {
        email, firstName, lastName,
        status, tenor, amount, balance,
        interest, paymentInstallment, repaid,
      } = info;
      const values = [email, firstName, lastName,
        status, tenor, amount, balance,
        interest, paymentInstallment, repaid];
      const response = await pool.query(queryText, values);

      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async getEmailByLoanId(id) {
    try {
      const queryText = 'SELECT useremail FROM loans WHERE id=$1';
      const response = await pool.query(queryText, [id]);

      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async getLoanByEmail(email) {
    try {
      const queryText = 'SELECT * FROM loans WHERE useremail=$1';
      const response = await pool.query(queryText, [email]);

      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  static async getLoanById(id) {
    try {
      const queryText = 'SELECT * FROM loans WHERE id=$1';
      const response = await pool.query(queryText, [id]);

      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async getAllLoans() {
    try {
      const queryText = 'SELECT * FROM loans';
      const response = await pool.query(queryText);

      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async getQueriedLoans(status, repaid) {
    try {
      const queryText = 'SELECT * FROM loans WHERE status=$1 AND repaid=$2';
      const response = await pool.query(queryText, [status, repaid]);

      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async loanApproval(status, id) {
    try {
      const queryText = 'UPDATE loans SET status=$1 WHERE id=$2 RETURNING id, amount, tenor, status, "paymentInstallment", interest';
      const response = await pool.query(queryText, [status, id]);

      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }


  static async updateUserBalance(balance, id) {
    const queryText = 'UPDATE loans SET balance=$1 WHERE id=$2  RETURNING *';
    const response = await pool.query(queryText, [balance, id]);

    return response;
  }


  static async setRepaid(repaid, balance) {
    const queryText = 'UPDATE loans SET repaid=true WHERE balance=$2 ';
    const response = await pool.query(queryText, [repaid, balance]);

    return response;
  }
}

export default loanData;
