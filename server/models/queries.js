class Queries {
  // Queries for user
  static createUser() {
    return `INSERT INTO users(firstName, lastName, email, password, address)
      VALUES($1,$2,$3,$4,$5) RETURNING firstName, lastName, email, address, status, isAdmin`;
  }

  static userQuery() {
    return 'SELECT * FROM users WHERE email = $1';
  }

  static userID() {
    return 'SELECT * FROM users WHERE id = $1';
  }

  static userVerify() {
    return "UPDATE users SET status='verified' WHERE email = $2";
  }

  // Queries for loans
  static createLoan() {
    return `INSERT INTO loans(userEmail, createdOn, tenor, amount, paymentInstallment, balance, interest) 
      VALUES($1,$2,$3,$4,$5,$6, $7) RETURNING *`;
  }

  static userEmail() {
    return 'SELECT * FROM loans WHERE userEmail = $1';
  }

  static getAllLoans() {
    return 'SELECT * FROM loans';
  }

  static getSpecificLoan() {
    return 'SELECT * FROM loans WHERE id=$1';
  }

  static queryLoan() {
    return 'SELECT * FROM loans WHERE status=$1 AND repaid=$2';
  }

  static approveLoan() {
    return 'UPDATE loans SET status=$1 WHERE id=$2';
  }

  static setBalance() {
    return 'UPDATE loans SET balance=$1 WHERE id=$2';
  }

  // Queries for Repayment
  static postRepayment() {
    return `INSERT INTO repayments(loanId, createdOn, amount, monthlyInstallment, paidAmount, balance) 
    VALUES($1,$2,$3,$4,$5,$6) RETURNING *`;
  }

  static getRepayment() {
    return 'SELECT * FROM repayments WHERE loanId=$1';
  }
}

export default Queries;
