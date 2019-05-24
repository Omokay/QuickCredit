import pool from './dbConnect';

class repayData {
  static async getRepaymentById(id) {
    const queryText = 'SELECT * FROM repayments WHERE "loanid"=$1';
    const response = await pool.query(queryText, [id]);

    return response;
  }

  static async postLoans(id, amount) {
    const queryText = `INSERT INTO repayments("loanId", amount)
                         VALUES($1, $2) RETURNING *`;
    const response = await pool.query(queryText, [id, amount]);

    return response;
  }
}
export default repayData;
