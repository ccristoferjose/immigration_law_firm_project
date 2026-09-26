import { HttpError } from './error.js';
import { verifyAdminToken } from '../utils/jwt.js';
import { verifyFirebaseIdToken, extractVerificationClaims } from '../utils/firebase.js';
import { callProc } from '../config/db.js';

function bearer(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Bearer ')) return null;
  return h.slice(7);
}

/** Require a valid admin/staff JWT. Optionally restrict to roles. */
export const requireAdmin = (...allowedRoles) => async (req, res, next) => {
  try {
    const token = bearer(req);
    if (!token) throw new HttpError(401, 'Missing authorization token');
    const payload = verifyAdminToken(token);
    if (payload.kind !== 'admin') throw new HttpError(401, 'Invalid token kind');
    if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
      throw new HttpError(403, 'Forbidden: insufficient role');
    }
    const rows = await callProc('sp_user_get_by_id', [payload.sub]);
    if (!rows.length || !rows[0].is_active) {
      throw new HttpError(401, 'User no longer active');
    }
    req.user = rows[0];
    next();
  } catch (err) {
    if (err instanceof HttpError) return next(err);
    return next(new HttpError(401, 'Invalid or expired token'));
  }
};

/**
 * Require a valid Firebase ID token (client users).
 * Also decorates the request with `req.verification` drawn from the token's claims,
 * and fire-and-forget-syncs the DB row when the token and DB disagree.
 */
export const requireClient = async (req, res, next) => {
  try {
    const token = bearer(req);
    if (!token) throw new HttpError(401, 'Missing authorization token');
    const decoded = await verifyFirebaseIdToken(token);
    req.firebaseUser = decoded;
    req.verification = extractVerificationClaims(decoded);

    const rows = await callProc('sp_client_get_by_firebase_uid', [decoded.uid]);
    req.clientRecord = rows[0] || null;

    if (req.clientRecord) {
      const dbEmail = !!req.clientRecord.email_verified;
      const dbPhone = !!req.clientRecord.phone_verified;
      if (dbEmail !== req.verification.emailVerified || dbPhone !== req.verification.phoneVerified) {
        callProc('sp_client_update_verification', [
          decoded.uid,
          req.verification.emailVerified ? 1 : 0,
          req.verification.phoneVerified ? 1 : 0,
        ]).catch((err) => console.warn('[auth] verification sync failed:', err.message));
      }
    }
    next();
  } catch (err) {
    if (err instanceof HttpError) return next(err);
    return next(new HttpError(401, err.message || 'Invalid Firebase token'));
  }
};

/**
 * Require a verified client — must have email_verified OR phone_number claim.
 * Chains on top of requireClient so route handlers see the full request decoration.
 */
export const requireVerifiedClient = [
  requireClient,
  (req, res, next) => {
    const v = req.verification;
    if (!v || !(v.emailVerified || v.phoneVerified)) {
      return next(
        new HttpError(
          403,
          'Verification required — please verify your email or phone before continuing.'
        )
      );
    }
    next();
  },
];
