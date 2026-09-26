#!/usr/bin/env node
/**
 * Transfer a Firebase service account JSON file into the project `.env`.
 *
 * - Auto-detects the JSON file in the project root (or takes an explicit path)
 * - Verifies it's actually a service_account file
 * - Serializes it to a single-line JSON value (safe for .env)
 * - Upserts FIREBASE_SERVICE_ACCOUNT and FIREBASE_PROJECT_ID in-place
 *   (preserving every other line of .env)
 * - Prints a short summary so you can eyeball the values
 *
 * Usage:
 *   node backend/scripts/setup-firebase-env.js
 *   node backend/scripts/setup-firebase-env.js ./service-account.json
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..', '..');
const envPath = join(projectRoot, '.env');

function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exit(1);
}

function findServiceAccount() {
  const explicit = process.argv[2];
  if (explicit) {
    const abs = resolve(process.cwd(), explicit);
    if (!existsSync(abs)) fail(`File not found: ${abs}`);
    return abs;
  }
  // Auto-discover: any *.json in project root whose contents look like a
  // service account. We intentionally read each candidate rather than
  // guessing by filename — Firebase's default filenames vary.
  const candidates = readdirSync(projectRoot)
    .filter((f) => f.endsWith('.json'))
    .map((f) => join(projectRoot, f))
    .filter((p) => statSync(p).isFile());

  const matches = [];
  for (const p of candidates) {
    try {
      const obj = JSON.parse(readFileSync(p, 'utf8'));
      if (obj.type === 'service_account' && obj.private_key && obj.client_email) {
        matches.push(p);
      }
    } catch {
      // not JSON, skip
    }
  }

  if (matches.length === 0) {
    fail(
      'No service account JSON found in project root.\n' +
        `Looked in: ${projectRoot}\n` +
        'Pass the path explicitly:\n' +
        '  node backend/scripts/setup-firebase-env.js /absolute/path/to/service-account.json'
    );
  }
  if (matches.length > 1) {
    fail(
      `Found multiple service account files — pass one explicitly:\n  ${matches.join('\n  ')}`
    );
  }
  return matches[0];
}

function upsertEnv(contents, key, value) {
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, 'm');
  if (re.test(contents)) return contents.replace(re, line);
  if (contents.length && !contents.endsWith('\n')) contents += '\n';
  return contents + line + '\n';
}

function main() {
  const saPath = findServiceAccount();
  const raw = readFileSync(saPath, 'utf8');

  let sa;
  try {
    sa = JSON.parse(raw);
  } catch (err) {
    fail(`Selected file is not valid JSON: ${saPath}\n${err.message}`);
  }
  if (sa.type !== 'service_account') {
    fail(`Selected file is not a service_account JSON (type=${sa.type}): ${saPath}`);
  }
  if (!sa.project_id || !sa.client_email || !sa.private_key) {
    fail(`Selected file is missing required fields (project_id / client_email / private_key): ${saPath}`);
  }

  // JSON.stringify is the ONLY safe way to embed the key in .env — it
  // escapes newlines, quotes, and backslashes so dotenv/compose parse
  // the value as a single token.
  const singleLine = JSON.stringify(sa);

  let envContents = '';
  if (existsSync(envPath)) envContents = readFileSync(envPath, 'utf8');
  else console.error(`⚠  ${envPath} did not exist — creating it.`);

  envContents = upsertEnv(envContents, 'FIREBASE_SERVICE_ACCOUNT', singleLine);
  envContents = upsertEnv(envContents, 'FIREBASE_PROJECT_ID', sa.project_id);

  writeFileSync(envPath, envContents, { mode: 0o600 });

  console.log('');
  console.log('✅ Firebase env vars written to .env');
  console.log('   source file    :', saPath);
  console.log('   project_id     :', sa.project_id);
  console.log('   client_email   :', sa.client_email);
  console.log('   JSON length    :', singleLine.length, 'chars');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Rebuild + restart the backend container (not just `up`):');
  console.log('       docker compose up -d --force-recreate backend');
  console.log('');
  console.log('  2. Verify:');
  console.log('       curl -s http://localhost:4000/api/debug/firebase');
  console.log('');
  console.log('     Expect: "available": true, "parseOk": true, "credentialOk": true');
  console.log('');
  console.log('  3. (Optional) Delete the service account file so it is not left on disk:');
  console.log(`       rm "${saPath}"`);
  console.log('');
  console.log('⚠  Make sure .env and *.json service account files are in .gitignore.');
}

main();
