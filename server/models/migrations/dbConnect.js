import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.QuickCreditDB_URL,
});
const db = {
  query: (text, params) => pool.query(text, params),
};

export default db;
