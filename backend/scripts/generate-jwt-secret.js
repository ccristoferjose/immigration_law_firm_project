#!/usr/bin/env node
/**
 * Generate a cryptographically strong JWT secret.
 *
 * Usage:
 *   node scripts/generate-jwt-secret.js              # 64-byte hex (default)
 *   node scripts/generate-jwt-secret.js --base64     # base64
 *   node scripts/generate-jwt-secret.js --bytes 32   # custom length
 *   node scripts/generate-jwt-secret.js --write      # write/update .env (JWT_SECRET=...)
 *
 * Flags can be combined, e.g.:
 *   node scripts/generate-jwt-secret.js --base64 --bytes 48 --write
 */

import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = { encoding: 'hex', bytes: 64, write: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base64') args.encoding = 'base64';
    else if (a === '--hex') args.encoding = 'hex';
    else if (a === '--bytes') args.bytes = parseInt(argv[++i], 10);
    else if (a === '--write') args.write = true;
    else if (a === '-h' || a === '--help') {
      console.log(
        [
          'Usage: node scripts/generate-jwt-secret.js [options]',
          '',
          'Options:',
          '  --hex            Output hex encoding (default)',
          '  --base64         Output base64 encoding',
          '  --bytes <n>      Number of random bytes (default 64)',
          '  --write          Write/replace JWT_SECRET in ../.env and ./.env',
          '  -h, --help       Show this help',
        ].join('\n')
      );
      process.exit(0);
    }
  }
  if (!Number.isInteger(args.bytes) || args.bytes < 16) {
    console.error('Error: --bytes must be an integer >= 16');
    process.exit(1);
  }
  return args;
}

function upsertEnvVar(filePath, key, value) {
  let contents = '';
  if (existsSync(filePath)) contents = readFileSync(filePath, 'utf8');
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(contents)) {
    contents = contents.replace(re, line);
  } else {
    if (contents.length && !contents.endsWith('\n')) contents += '\n';
    contents += `${line}\n`;
  }
  writeFileSync(filePath, contents, { mode: 0o600 });
}

const args = parseArgs(process.argv.slice(2));
const secret = randomBytes(args.bytes).toString(args.encoding);

if (args.write) {
  // Project root .env (for docker compose) and backend/.env (for local `npm run dev`)
  const targets = [
    resolve(__dirname, '..', '..', '.env'),
    resolve(__dirname, '..', '.env'),
  ];
  for (const t of targets) {
    upsertEnvVar(t, 'JWT_SECRET', secret);
    console.error(`[generate-jwt-secret] wrote JWT_SECRET to ${t}`);
  }
}

// Always print the secret to stdout so it can be captured in a shell pipeline,
// e.g.  export JWT_SECRET="$(node scripts/generate-jwt-secret.js)"
process.stdout.write(secret + '\n');
