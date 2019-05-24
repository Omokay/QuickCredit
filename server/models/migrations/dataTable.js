/* eslint-disable no-console */
import Authenticate from '../../authentication/auth';
import pool from './dbConnect';


(async () => {
  try {
    console.log('Creating user');
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
           id SERIAL PRIMARY KEY,
           firstName VARCHAR(50) NOT NULL,
           lastName VARCHAR(50) NOT NULL,
           email VARCHAR(50) UNIQUE NOT NULL,
           password TEXT NOT NULL,
           address VARCHAR(100) NOT NULL,
           status VARCHAR(20) DEFAULT 'unverified',
           isAdmin BOOLEAN DEFAULT FALSE);`);

    console.log('Creating loan');
    await pool.query(`CREATE TABLE IF NOT EXISTS loans(
                id SERIAL NOT NULL PRIMARY KEY,
                userEmail VARCHAR(50) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
                createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(20) NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
                repaid BOOLEAN DEFAULT FALSE,
                tenor INT NOT NULL CHECK(0 < tenor AND tenor <= 12),
                amount NUMERIC NOT NULL,
                paymentInstallment NUMERIC NOT NULL,
                balance NUMERIC NOT NULL,
                interest NUMERIC NOT NULL
              );`);

    console.log('Creating repayments');
    await pool.query(`CREATE TABLE IF NOT EXISTS repayments(
                id SERIAL UNIQUE PRIMARY KEY,
                loanId INT NOT NULL REFERENCES loans(id) ON DELETE CASCADE ON UPDATE CASCADE,
                createdOn DATE DEFAULT CURRENT_TIMESTAMP,
                amount NUMERIC NOT NULL CHECK(amount > 0),
                monthlyInstallment NUMERIC NOT NULL,
                paidAmount NUMERIC NOT NULL,
                balance NUMERIC NOT NULL 
                );`);

    await pool.query(`INSERT INTO users
      (firstName, lastName, email, password, address, status, isadmin)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7)`,
    ['omoke', 'david', 'omoke@admin.com', Authenticate.hashPassword('password'), 'Andela Epic Tower Control Room', 'verified', 'true']);
  } catch (error) {
    console.log(error);
  }
})();
