/* eslint-disable no-console */
import Authenticate from '../../authentication/auth';
import pool from './dbConnect';

class userData {
  // User queries >>>>>>>>
  static async createUser(info) {
    try {
      const queryText = `INSERT INTO users(firstName, lastName, email, password, address)
    VALUES($1,$2,$3,$4,$5) RETURNING *`;

      const {
        firstName,
        lastName,
        email,
        password,
        address,
      } = info;

      const hashedPassword = Authenticate.hashPassword(password);
      const values = [firstName, lastName, email, hashedPassword, address];

      const response = await pool.query(queryText, values);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static async getUserByEmail(email) {
    try {
      const queryText = 'SELECT * FROM users WHERE email=$1';
      const response = await pool.query(queryText, [email]);
      return response;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  static async getUserById(id) {
    const queryText = 'SELECT * FROM users WHERE id=$1';
    const response = await pool.query(queryText, [id]);
    return response;
  }

  static async userVerify(email) {
    try {
      const queryText = "UPDATE users SET status='verified' WHERE email=$1";
      const response = await pool.query(queryText, [email]);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
export default userData;
