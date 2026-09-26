import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { pool, query } from '../config/db.js';
import { env } from '../config/env.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Runs at server startup:
 * 1. Waits for DB to be reachable.
 * 2. Renames plural table names to singular (migration for existing volumes).
 * 3. Ensures new columns exist on tables.
 * 4. Loads/reloads stored procedures.
 * 5. Seeds default admin and settings if missing.
 */
export async function bootstrap() {
  await waitForDb();

  // Migrate plural -> singular table names for existing databases
  await renameTablesIfNeeded();

  // Schema evolution — add new columns that didn't exist before
  await ensureColumn('client', 'client_type', "ENUM('existing','prospective') NOT NULL DEFAULT 'prospective' AFTER case_number");
  await ensureColumn('client', 'phone_verified', 'TINYINT(1) NOT NULL DEFAULT 0 AFTER client_type');
  await ensureColumn('client', 'email_verified', 'TINYINT(1) NOT NULL DEFAULT 0 AFTER phone_verified');
  await ensureColumn('client', 'preferred_contact_time', 'VARCHAR(11) NULL AFTER email_verified');
  await ensureColumn('appointment_type', 'case_prefix', "VARCHAR(8) NOT NULL DEFAULT 'GEN' AFTER duration_minutes");
  await ensureColumn('appointment', 'preferred_contact_time', 'VARCHAR(11) NULL AFTER staff_notes');
  await ensureColumn('appointment', 'review_notes', 'TEXT NULL AFTER preferred_contact_time');
  await ensureColumn('appointment', 'reviewed_by_user_id', 'INT NULL AFTER review_notes');
  await ensureColumn('appointment', 'reviewed_at', 'DATETIME NULL AFTER reviewed_by_user_id');

  // Ensure the appointment status ENUM includes new values
  await ensureAppointmentStatusEnum();

  // Create case_number_sequence table if it doesn't exist
  await query(`
    CREATE TABLE IF NOT EXISTS \`case_number_sequence\` (
      prefix     VARCHAR(8) PRIMARY KEY,
      next_seq   INT NOT NULL DEFAULT 0,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);

  // Ensure reviewed_by FK exists
  await ensureForeignKey('appointment', 'fk_appt_reviewer', 'reviewed_by_user_id', 'user', 'id', 'SET NULL');

  // Normalize charset/collation across DB + all tables (must run before loadProcedures
  // so procedure parameter collations match the columns they compare against).
  await ensureCollation('utf8mb4', 'utf8mb4_0900_ai_ci');

  // Load stored procedures (idempotent — each uses DROP IF EXISTS)
  await loadProcedures();

  // Bootstrap default admin if no users exist
  const users = await query('SELECT COUNT(*) AS c FROM `user`');
  if (users[0].c === 0) {
    const hash = await bcrypt.hash(env.bootstrapAdmin.password, 10);
    await query(
      'CALL sp_user_create(?, ?, ?, ?)',
      [env.bootstrapAdmin.email, hash, env.bootstrapAdmin.fullName, 'admin']
    );
    console.log(
      `[bootstrap] Created default admin: ${env.bootstrapAdmin.email} / ${env.bootstrapAdmin.password}`
    );
  }

  // Ensure staff_login_path setting exists
  await ensureStaffLoginPath();
}

/**
 * Rename plural table names to singular for existing databases.
 * MySQL RENAME TABLE is atomic and updates FK references automatically.
 */
async function renameTablesIfNeeded() {
  const renames = [
    ['users', 'user'],
    ['clients', 'client'],
    ['appointments', 'appointment'],
    ['appointment_types', 'appointment_type'],
    ['blocked_times', 'blocked_time'],
    ['settings', 'setting'],
    ['google_tokens', 'google_token'],
  ];

  for (const [oldName, newName] of renames) {
    const oldExists = await tableExists(oldName);
    const newExists = await tableExists(newName);
    if (oldExists && !newExists) {
      await query(`RENAME TABLE \`${oldName}\` TO \`${newName}\``);
      console.log(`[bootstrap] Renamed table ${oldName} -> ${newName}`);
    }
  }
}

async function tableExists(name) {
  const rows = await query(
    `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [name]
  );
  return rows.length > 0;
}

async function ensureColumn(table, column, definition) {
  const rows = await query(
    `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?`,
    [table, column]
  );
  if (rows.length === 0) {
    await query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    console.log(`[bootstrap] Added column ${table}.${column}`);
  }
}

async function ensureAppointmentStatusEnum() {
  const rows = await query(
    `SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'appointment'
        AND COLUMN_NAME = 'status'`
  );
  if (rows.length && !rows[0].COLUMN_TYPE.includes('pending_review')) {
    await query(`
      ALTER TABLE \`appointment\`
      MODIFY COLUMN status ENUM('pending_review','scheduled','completed','cancelled','no_show','rejected')
      NOT NULL DEFAULT 'scheduled'
    `);
    console.log('[bootstrap] Updated appointment.status ENUM with new values');
  }
}

async function ensureForeignKey(table, fkName, column, refTable, refColumn, onDelete) {
  const rows = await query(
    `SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND CONSTRAINT_NAME = ?
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'`,
    [table, fkName]
  );
  if (rows.length === 0) {
    try {
      await query(`
        ALTER TABLE \`${table}\`
        ADD CONSTRAINT \`${fkName}\`
        FOREIGN KEY (\`${column}\`) REFERENCES \`${refTable}\`(\`${refColumn}\`)
        ON DELETE ${onDelete}
      `);
      console.log(`[bootstrap] Added FK ${fkName} on ${table}.${column}`);
    } catch (err) {
      // May fail if column doesn't exist yet on the referenced table; non-fatal
      console.warn(`[bootstrap] FK ${fkName} creation skipped:`, err.message);
    }
  }
}

/**
 * Convert the database default and any table not already on the target collation.
 * Uses CONVERT TO CHARACTER SET, which rewrites column metadata + data in place.
 */
async function ensureCollation(charset, collation) {
  const [dbRow] = await query(
    `SELECT DEFAULT_COLLATION_NAME AS c
       FROM INFORMATION_SCHEMA.SCHEMATA
      WHERE SCHEMA_NAME = DATABASE()`
  );
  if (dbRow && dbRow.c !== collation) {
    await query(`ALTER DATABASE \`${await currentDb()}\` CHARACTER SET ${charset} COLLATE ${collation}`);
    console.log(`[bootstrap] Database default collation -> ${collation}`);
  }

  const tables = await query(
    `SELECT TABLE_NAME, TABLE_COLLATION
       FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE'`
  );
  for (const t of tables) {
    if (t.TABLE_COLLATION !== collation) {
      await query(`ALTER TABLE \`${t.TABLE_NAME}\` CONVERT TO CHARACTER SET ${charset} COLLATE ${collation}`);
      console.log(`[bootstrap] Converted table ${t.TABLE_NAME} -> ${collation}`);
    }
  }
}

async function currentDb() {
  const [row] = await query('SELECT DATABASE() AS db');
  return row.db;
}

/**
 * Load stored procedures from procedures.sql.
 * Splits on DELIMITER directives and executes each block.
 */
async function loadProcedures() {
  const filePath = join(__dirname, 'procedures.sql');
  let sql;
  try {
    sql = readFileSync(filePath, 'utf8');
  } catch (err) {
    console.warn('[bootstrap] procedures.sql not found, skipping:', err.message);
    return;
  }

  // Remove the USE statement if present (we're already in the correct DB)
  sql = sql.replace(/^USE\s+\w+;\s*/im, '');

  // Strip single-line comments before parsing. Without this, a `-- comment`
  // preceding a DROP on the same split block causes the whole block (DROP
  // included) to be filtered out because its trimmed form starts with `--`.
  sql = sql
    .split('\n')
    .map((line) => (line.trim().startsWith('--') ? '' : line))
    .join('\n');

  // Split on DELIMITER directives
  // Pattern: statements between delimiters
  const blocks = [];
  const parts = sql.split(/^DELIMITER\s+(.+)$/gm);

  // parts alternates: [text-before, delimiter, text-after-delimiter, delimiter, ...]
  let currentDelim = ';';
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    if (part === '//' || part === ';') {
      currentDelim = part;
      continue;
    }

    // Split this block by the current delimiter
    const stmts = part.split(currentDelim === '//' ? /\/\//g : /;(?=\s*$)/gm);
    for (const stmt of stmts) {
      const trimmed = stmt.trim();
      if (trimmed && trimmed !== ';') {
        blocks.push(trimmed);
      }
    }
  }

  // Execute each block using pool.query (not pool.execute, which doesn't support multi-statement)
  const conn = await pool.getConnection();
  try {
    for (const block of blocks) {
      if (block.length < 5) continue;
      try {
        await conn.query(block);
      } catch (err) {
        console.warn(`[bootstrap] Procedure load error: ${err.message}\n  SQL: ${block.substring(0, 100)}...`);
      }
    }
    console.log(`[bootstrap] Loaded ${blocks.length} procedure blocks`);
  } finally {
    conn.release();
  }
}

async function ensureStaffLoginPath() {
  const rows = await query("SELECT value FROM `setting` WHERE `key` = 'staff_login_path'");
  if (rows.length === 0 || !rows[0].value) {
    const path = crypto.randomBytes(12).toString('hex');
    await query(
      "INSERT INTO `setting` (`key`, value) VALUES ('staff_login_path', ?) ON DUPLICATE KEY UPDATE value = ?",
      [path, path]
    );
    console.log(`[bootstrap] Generated staff login path: ${path}`);
  }
}

async function waitForDb(retries = 30, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await pool.getConnection();
      conn.release();
      return;
    } catch (err) {
      console.log(`[bootstrap] Waiting for MySQL... (${i + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error('Database not reachable after retries');
}
