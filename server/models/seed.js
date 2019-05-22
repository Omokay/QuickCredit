import db from './migrations/dbConnect';
import Authenticate from '../authentication/auth';


const addData = async () => {
  try {
    const addToUser = await db.query(`
    INSERT INTO users (firstName, lastName, email, password, address, isadmin) 
    VALUES ('Chuku', 'Omoke', 'chuku.omoke@gmail.com', ${Authenticate.hashPassword('password')}, 'Andela Epic Tower', false),
            ('Weje', 'Emmanuel', 'wejem@yahoo.com', ${Authenticate.hashPassword('password')}, 'No 1 Yaba road lagos', false),
            ('Ukpa', 'Ikechuku', 'sir_ik@gmail.com', ${Authenticate.hashPassword('password')}, 'No 1 Akin Lakanu Close', false);`);

    const addToLoans = await db.query(`
    INSERT INTO loans (userEmail, status, repaid, tenor, amount, paymentInstallment, balance, interest)
    VALUES ('chuku.omoke@gmail.com','approved', 'true', 12, 50000, 5666.52, 0, 2500),
            ('wejem@yahoo.com', 'approved', 'false', 12, 100000, 12333.102, 45000, 2500);`);

    const postToRepayment = await db.query(`
    INSERT INTO repayments (loanId, amount, monthlyInstallment, paidAmount, balance)
      VALUES (1, '20000', '2300', '2300', '17700');`);

    console.log(addToUser, addToLoans, postToRepayment);
  } catch (error) {
    return error.stack;
  }
  return true;
};

addData();
