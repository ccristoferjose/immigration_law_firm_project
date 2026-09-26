import admin from 'firebase-admin';
import { webcrypto } from 'node:crypto';
import { env } from '../config/env.js';

let initialized = false;
let available = false;

// Diagnostic state so /api/debug/firebase and logs can tell you exactly why
// firebase-admin failed to init. Never exposes the private key itself.
let diagnostic = {
  envVarPresent: false,
  envVarLength: 0,
  parseOk: false,
  credentialOk: false,
  projectId: null,
  clientEmail: null,
  error: null,
};

function init() {
  if (initialized) return;
  initialized = true;

  const raw = env.firebase.serviceAccountJson;
  diagnostic.envVarPresent = !!raw;
  diagnostic.envVarLength = raw ? raw.length : 0;

  if (!raw) {
    diagnostic.error =
      'FIREBASE_SERVICE_ACCOUNT env var is empty or missing. Firebase Admin cannot verify ID tokens.';
    // eslint-disable-next-line no-console
    console.warn('[firebase] ' + diagnostic.error);
    return;
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(raw);
    diagnostic.parseOk = true;
  } catch (err) {
    diagnostic.error = `JSON.parse failed: ${err.message}. Most common cause: unescaped newlines in the private_key field. Use JSON.stringify to produce a safe single-line value.`;
    // eslint-disable-next-line no-console
    console.error('[firebase] ' + diagnostic.error);
    return;
  }

  // Normalize common private_key pitfalls — when the JSON is passed through
  // docker/shell, literal `\n` sequences often survive instead of real
  // newlines. firebase-admin needs actual newlines in the PEM.
  if (typeof serviceAccount.private_key === 'string') {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  diagnostic.projectId = serviceAccount.project_id || null;
  diagnostic.clientEmail = serviceAccount.client_email || null;

  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: env.firebase.projectId || serviceAccount.project_id,
    });
    diagnostic.credentialOk = true;
    available = true;
    // eslint-disable-next-line no-console
    console.log(
      `[firebase] initialized for project "${diagnostic.projectId}" (client_email: ${diagnostic.clientEmail})`
    );
  } catch (err) {
    diagnostic.error = `admin.credential.cert() failed: ${err.message}. Usually means the private_key is malformed (check PEM headers / newline escaping).`;
    // eslint-disable-next-line no-console
    console.error('[firebase] ' + diagnostic.error);
  }
}

export async function verifyFirebaseIdToken(idToken) {
  init();
  if (!available) {
    const base = 'Firebase Admin is not configured on the server';
    throw new Error(diagnostic.error ? `${base}: ${diagnostic.error}` : base);
  }
  return admin.auth().verifyIdToken(idToken);
}

/**
 * Extract verification state from a decoded Firebase ID token.
 * - emailVerified: reflects the token's `email_verified` claim.
 * - phoneVerified: Firebase only issues `phone_number` claims after a successful
 *   phone OTP exchange, so its presence is equivalent to phone verification.
 */
export function extractVerificationClaims(decoded) {
  return {
    emailVerified: !!decoded?.email_verified,
    phoneVerified: !!decoded?.phone_number,
    signInProvider: decoded?.firebase?.sign_in_provider || null,
  };
}

export function firebaseAvailable() {
  init();
  return available;
}

/**
 * Create (or recover) a Firebase Auth account for an existing client that the
 * assistant is registering in-person. Returns the Firebase user. If the email
 * already has an account we silently return that one — the caller will still
 * trigger a password-reset so the client can get in.
 */
export async function createFirebaseUserForAssistant({ email, displayName, phoneNumber }) {
  init();
  if (!available) throw new Error('Firebase Admin is not configured on the server');
  try {
    return await admin.auth().createUser({
      email,
      displayName,
      phoneNumber: phoneNumber || undefined,
      // Random password — client receives a reset link and sets their own.
      password: cryptoRandomPassword(),
      emailVerified: false,
    });
  } catch (err) {
    if (err?.code === 'auth/email-already-exists') {
      return await admin.auth().getUserByEmail(email);
    }
    throw err;
  }
}

export async function generatePasswordResetLinkFor(email) {
  init();
  if (!available) throw new Error('Firebase Admin is not configured on the server');
  return admin.auth().generatePasswordResetLink(email);
}

function cryptoRandomPassword() {
  // 24 bytes → 32 URL-safe chars, enough entropy to be unguessable.
  const bytes = new Uint8Array(24);
  webcrypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url');
}

export function firebaseDiagnostic() {
  init();
  // Return a safe copy — never the raw env var or private key.
  return {
    available,
    envVarPresent: diagnostic.envVarPresent,
    envVarLength: diagnostic.envVarLength,
    parseOk: diagnostic.parseOk,
    credentialOk: diagnostic.credentialOk,
    projectId: diagnostic.projectId,
    clientEmail: diagnostic.clientEmail,
    configuredProjectId: env.firebase.projectId || null,
    error: diagnostic.error,
  };
}
