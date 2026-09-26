import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendEmailVerification as fbSendEmailVerification,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
} from 'firebase/auth';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;

export function firebaseConfigured() {
  return !!(cfg.apiKey && cfg.authDomain && cfg.projectId);
}

export function getFirebaseAuth() {
  if (!firebaseConfigured()) return null;
  if (!app) {
    app = getApps()[0] || initializeApp(cfg);
    auth = getAuth(app);
  }
  return auth;
}

export async function clientRegister(email, password) {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase is not configured');
  const cred = await createUserWithEmailAndPassword(a, email, password);
  return cred.user;
}

export async function clientLogin(email, password) {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase is not configured');
  const cred = await signInWithEmailAndPassword(a, email, password);
  return cred.user;
}

export async function clientLogout() {
  const a = getFirebaseAuth();
  if (!a) return;
  await fbSignOut(a);
}

export function onClientAuthStateChanged(cb) {
  const a = getFirebaseAuth();
  if (!a) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(a, cb);
}

export async function getClientIdToken() {
  const a = getFirebaseAuth();
  if (!a || !a.currentUser) return null;
  return a.currentUser.getIdToken();
}

// ---------- Phone verification (prospective clients) ----------

/**
 * Set up an invisible reCAPTCHA verifier on a DOM element.
 * Must be called before sendPhoneVerification.
 */
export function setupRecaptcha(elementId) {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase is not configured');
  return new RecaptchaVerifier(a, elementId, { size: 'invisible' });
}

/**
 * Send a phone verification SMS. Returns a ConfirmationResult.
 */
export async function sendPhoneVerification(phoneNumber, recaptchaVerifier) {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase is not configured');
  return signInWithPhoneNumber(a, phoneNumber, recaptchaVerifier);
}

/**
 * Confirm the OTP code received via SMS. Returns a UserCredential.
 */
export async function confirmPhoneCode(confirmationResult, code) {
  return confirmationResult.confirm(code);
}

// ---------- Email verification ----------

/**
 * Trigger Firebase's built-in email-verification link.
 *
 * We deliberately omit actionCodeSettings / continue URL. Firebase then sends
 * the email using its default action handler page (hosted on
 * <project>.firebaseapp.com), which always works regardless of which domains
 * are whitelisted under Authentication → Settings → Authorized domains.
 *
 * After the user clicks the link, Firebase flips the email_verified claim on
 * the account. They return to our app manually; AuthContext.refreshClient()
 * picks the new claim up on the next token refresh.
 */
export async function sendClientEmailVerification() {
  const a = getFirebaseAuth();
  if (!a || !a.currentUser) throw new Error('No active session');
  await fbSendEmailVerification(a.currentUser);
}

export async function sendPasswordResetEmail(email) {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase is not configured');
  await fbSendPasswordResetEmail(a, email);
}

export async function reloadClientUser() {
  const a = getFirebaseAuth();
  if (!a || !a.currentUser) return null;
  await a.currentUser.reload();
  return a.currentUser;
}
