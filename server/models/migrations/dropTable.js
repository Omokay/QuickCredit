/* eslint-disable no-console */
import pool from './dbConnect';

(async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS users CASCADE');
    await pool.query('DROP TABLE IF EXISTS loans CASCADE');
    await pool.query('DROP TABLE IF EXISTS repayments CASCADE');
  } catch (error) {
    console.log(error);
  }
})();
