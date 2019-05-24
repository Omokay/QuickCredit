import '@babel/polyfill/noConflict';
import { Pool, types } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

types.setTypeParser(1700, value => parseFloat(value));

const pool = new Pool({
  connectionString: process.env.QuickCreditDB_URL,

});

export default pool;
