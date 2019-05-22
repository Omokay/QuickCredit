import db from './migrations/dbConnect';
import '@babel/polyfill';
import Authenticate from '../authentication/auth';

// eslint-disable-next-line consistent-return
const dbTables = async () => {
  try {
    const dropUser = await db.query('DROP TABLE IF EXISTS users CASCADE;');
    const dropLoan = await db.query('DROP TABLE IF EXISTS loans CASCADE;');
    const dropRepayment = await db.query('DROP TABLE IF EXISTS repayments CASCADE;');

    const createUserTable = await db.query(`CREATE TABLE IF NOT EXISTS users(
         id SERIAL PRIMARY KEY,
         firstName VARCHAR(50) NOT NULL,
         lastName VARCHAR(50) NOT NULL,
         email VARCHAR(50) UNIQUE NOT NULL,
         password TEXT NOT NULL,
         address VARCHAR(100) NOT NULL,
         status VARCHAR(20) DEFAULT 'unverified',
         isAdmin BOOLEAN DEFAULT FALSE);`);

    const createLoanTable = await db.query(`CREATE TABLE IF NOT EXISTS loans(
        id SERIAL UNIQUE PRIMARY KEY,
        userEmail VARCHAR(50) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
        createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending',
        repaid BOOLEAN DEFAULT FALSE,
        tenor INT NOT NULL,
        amount NUMERIC NOT NULL,
        paymentInstallment NUMERIC NOT NULL,
        balance NUMERIC NOT NULL,
        interest NUMERIC NOT NULL);`);

    const createRepaymentTable = await db.query(`CREATE TABLE IF NOT EXISTS repayments(
        id SERIAL UNIQUE PRIMARY KEY,
        loanId INT NOT NULL REFERENCES loans(id) ON DELETE CASCADE ON UPDATE CASCADE,
        createdOn DATE DEFAULT CURRENT_TIMESTAMP,
        amount NUMERIC NOT NULL,
        monthlyInstallment NUMERIC NOT NULL,
        paidAmount NUMERIC NOT NULL,
        balance NUMERIC NOT NULL 
        );`);


    const values = ['omoke', 'david', 'omoke@admin.com', Authenticate.hashPassword('password'), 'Andela Epic Tower Control Room', 'verified', 'true'];
    const admin = await db.query('INSERT INTO users(firstName, lastName, email, password, address, status, isAdmin) VALUES ($1,$2,$3,$4,$5,$6,$7)', values);

    // eslint-disable-next-line no-console
    console.log(
      dropUser,
      dropLoan,
      dropRepayment,
      createUserTable,
      createLoanTable,
      createRepaymentTable,
      admin,
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.stack);
    return err.stack;
  }
};
dbTables();
