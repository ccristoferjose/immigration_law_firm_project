import mysql from 'mysql2/promise';
import { env } from './env.js';

export const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z', // UTC
  dateStrings: false,
});

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * Call a stored procedure and return the first result set.
 * MySQL CALL returns [[rows], fields] — we unwrap to the row array.
 */
export async function callProc(name, params = []) {
  const placeholders = params.map(() => '?').join(', ');
  const [results] = await pool.execute(`CALL ${name}(${placeholders})`, params);
  return results[0]; // first result set (array of rows)
}

export async function withTransaction(fn) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
