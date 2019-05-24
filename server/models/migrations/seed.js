import pool from './dbConnect';
import Authenticate from '../../authentication/auth';


(async () => {
  try {
    await pool.query(`INSERT INTO users firstname, lastname, email, password, address, isadmin) 
        VALUES ('Chuku', 'Omoke', 'chuku.omoke@gmail.com', ${Authenticate.hashPassword('password')}, 'Andela Epic Tower', false),
                ('Weje', 'Emmanuel', 'wejem@yahoo.com', ${Authenticate.hashPassword('password')}, 'No 1 Yaba road lagos', false),
                ('Ukpa', 'Ikechuku', 'sir_ik@gmail.com', ${Authenticate.hashPassword('password')}, 'No 1 Akin Lakanu Close', false);`);

    await pool.query(`INSERT INTO loans (useremail, status, repaid, tenor, amount, paymentinstallment, balance, interest)
    VALUES ('chuku.omoke@gmail.com','approved', 'true', 12, 50000, 5666.52, 0, 2500),
            ('wejem@yahoo.com', 'approved', 'false', 12, 100000, 12333.102, 45000, 2500);`);

    await pool.query(`INSERT INTO repayments (loanid, amount, monthlyInstallment, paidamount, balance)
            VALUES (1, '20000', '2300', '2300', '17700');`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
})();
