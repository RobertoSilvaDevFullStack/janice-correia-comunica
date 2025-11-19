import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL || '';
const disableSslFlag = (process.env.DB_SSL || '').toLowerCase() === 'disable';
const urlDisablesSsl = /sslmode=disable/i.test(url);

const sslOption = (disableSslFlag || urlDisablesSsl)
  ? false
  : (process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false);

const pool = new Pool({
  connectionString: url,
  ssl: sslOption,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
