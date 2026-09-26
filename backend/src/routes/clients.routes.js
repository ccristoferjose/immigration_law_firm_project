import { Router } from 'express';
import { z } from 'zod';
import { callProc } from '../config/db.js';
import { validate } from '../middleware/validate.js';
import { requireAdmin, requireClient } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import {
  createFirebaseUserForAssistant,
  generatePasswordResetLinkFor,
  firebaseAvailable,
} from '../utils/firebase.js';

const router = Router();

const clientSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
  case_number: z.string().optional().nullable(),
  client_type: z.enum(['existing', 'prospective']).optional().default('prospective'),
  notes: z.string().optional().nullable(),
  preferred_contact_time: z.string().optional().nullable(),
});

const profileUpdateSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3),
});

// ---------- Public: verify case number exists ----------
router.get('/clients/verify-case/:caseNumber', async (req, res) => {
  const rows = await callProc('sp_client_get_by_case_number', [req.params.caseNumber]);
  res.json({ valid: rows.length > 0 });
});

// ---------- Client self-registration / upsert ----------
router.post('/clients/self', requireClient, async (req, res) => {
  const parsed = clientSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Validation error', parsed.error.flatten());
  }
  const { full_name, email, phone, case_number, client_type, notes } = parsed.data;
  const uid = req.firebaseUser.uid;

  // If existing client, validate case number + ownership
  if (client_type === 'existing') {
    if (!case_number) {
      throw new HttpError(400, 'Existing clients must provide a case number');
    }
    const caseRows = await callProc('sp_client_get_by_case_number', [case_number]);
    if (caseRows.length === 0) {
      throw new HttpError(400, 'Invalid case number — no matching record found');
    }
    const owner = caseRows[0];
    // Case can be claimed if unbound (firebase_uid null) or already belongs to this user.
    if (owner.firebase_uid && owner.firebase_uid !== uid) {
      throw new HttpError(403, 'This case number is bound to another account');
    }
  }

  const rows = await callProc('sp_client_upsert_by_firebase', [
    uid,
    full_name,
    email,
    phone,
    case_number || null,
    client_type,
    notes || null,
    req.verification.emailVerified ? 1 : 0,
    req.verification.phoneVerified ? 1 : 0,
  ]);
  const status = req.clientRecord ? 200 : 201;
  res.status(status).json({ client: rows[0] });
});

// Client fetches their own record
router.get('/clients/self', requireClient, async (req, res) => {
  res.json({
    client: req.clientRecord,
    verification: req.verification,
  });
});

// Combined dashboard payload — profile + upcoming + past appointments in one round trip.
router.get('/clients/self/dashboard', requireClient, async (req, res) => {
  if (!req.clientRecord) {
    return res.json({
      client: null,
      verification: req.verification,
      upcoming: [],
      past: [],
    });
  }
  const rows = await callProc('sp_appointment_list_by_client', [req.clientRecord.id]);
  const now = new Date();
  const upcoming = [];
  const past = [];
  for (const row of rows) {
    const end = new Date(row.end_at);
    const isPast =
      end < now ||
      row.status === 'completed' ||
      row.status === 'cancelled' ||
      row.status === 'no_show' ||
      row.status === 'rejected';
    (isPast ? past : upcoming).push(row);
  }
  past.reverse();
  res.json({
    client: req.clientRecord,
    verification: req.verification,
    upcoming,
    past,
  });
});

// One-time binding of a Firebase UID to an existing, unclaimed client record.
// Flow: assistant created the client record with a case_number but no Firebase
// UID. Client signs in, gets no profile, enters their case_number here.
router.post('/clients/self/link', requireClient, async (req, res) => {
  const { case_number } = req.body || {};
  if (!case_number || typeof case_number !== 'string') {
    throw new HttpError(400, 'case_number is required');
  }
  if (req.clientRecord) {
    throw new HttpError(400, 'Your account is already linked to a client profile');
  }

  const tokenEmail = req.firebaseUser.email || null;
  const tokenPhone = req.firebaseUser.phone_number || null;

  const rows = await callProc('sp_client_link_firebase_uid', [
    case_number,
    req.firebaseUser.uid,
    tokenEmail,
    tokenPhone,
    req.verification.emailVerified ? 1 : 0,
    req.verification.phoneVerified ? 1 : 0,
  ]);
  if (!rows.length) {
    throw new HttpError(
      403,
      'Case number not found, already linked, or does not match the email/phone on file.'
    );
  }
  res.json({ client: rows[0] });
});

// Client self-service profile update (cannot change case_number)
router.put('/clients/self/profile', requireClient, async (req, res) => {
  const parsed = profileUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Validation error', parsed.error.flatten());
  }
  if (!req.clientRecord) {
    throw new HttpError(400, 'No client profile found');
  }
  const { full_name, email, phone } = parsed.data;
  const rows = await callProc('sp_client_update_profile', [
    req.firebaseUser.uid, full_name, email, phone,
  ]);
  res.json({ client: rows[0] });
});

// ---------- Admin CRUD ----------
router.get('/clients', requireAdmin(), async (req, res) => {
  const search = (req.query.search || '').toString().trim();
  const rows = await callProc('sp_client_list', [search || null]);
  res.json({ clients: rows });
});

router.post(
  '/clients',
  requireAdmin(),
  validate(clientSchema),
  async (req, res) => {
    const { full_name, email, phone, case_number, client_type, notes } = req.body;
    const rows = await callProc('sp_client_create_admin', [
      full_name, email, phone, case_number || null, client_type || 'prospective', notes || null,
    ]);
    res.status(201).json({ client: rows[0] });
  }
);

// Admin creates an existing (in-person) client that needs a login account.
// We create the client record in our DB, create a Firebase Auth account,
// and generate a password-reset link the assistant can email/hand to the client.
// The client record's firebase_uid stays NULL — it is bound on first sign-in
// via POST /clients/self/link using the case_number as the challenge.
const existingWithAuthSchema = clientSchema.extend({
  case_number: z.string().min(1, 'case_number is required for existing clients'),
});
router.post(
  '/clients/with-auth',
  requireAdmin(),
  validate(existingWithAuthSchema),
  async (req, res) => {
    if (!firebaseAvailable()) {
      throw new HttpError(
        503,
        'Firebase Admin is not configured on the server — cannot create login accounts.'
      );
    }
    const { full_name, email, phone, case_number, notes, preferred_contact_time } = req.body;

    // Create the client record first. If Firebase fails afterward we keep the
    // DB row so the assistant can retry sending the reset link later.
    const rows = await callProc('sp_client_create_admin', [
      full_name, email, phone, case_number, 'existing', notes || null,
    ]);
    const client = rows[0];

    let resetLink = null;
    let firebaseError = null;
    try {
      await createFirebaseUserForAssistant({
        email,
        displayName: full_name,
        phoneNumber: phone?.startsWith('+') ? phone : undefined,
      });
      resetLink = await generatePasswordResetLinkFor(email);
    } catch (err) {
      firebaseError = err.message || 'Failed to create Firebase auth account';
      console.warn('[clients/with-auth] Firebase error:', firebaseError);
    }

    // preferred_contact_time is optional here — admin may want to set it later.
    if (preferred_contact_time) {
      await callProc('sp_client_update_admin', [
        client.id, full_name, email, phone, case_number, 'existing',
        notes || null, preferred_contact_time,
      ]);
    }

    res.status(201).json({ client, reset_link: resetLink, firebase_error: firebaseError });
  }
);

router.get('/clients/:id', requireAdmin(), async (req, res) => {
  const clientRows = await callProc('sp_client_get_by_id', [req.params.id]);
  if (!clientRows.length) throw new HttpError(404, 'Client not found');
  const apptRows = await callProc('sp_appointment_list', [null, null, null, parseInt(req.params.id)]);
  res.json({ client: clientRows[0], appointments: apptRows });
});

router.put(
  '/clients/:id',
  requireAdmin(),
  validate(clientSchema),
  async (req, res) => {
    const { full_name, email, phone, case_number, client_type, notes, preferred_contact_time } = req.body;
    const rows = await callProc('sp_client_update_admin', [
      req.params.id,
      full_name,
      email,
      phone,
      case_number || null,
      client_type || 'prospective',
      notes || null,
      preferred_contact_time || null,
    ]);
    if (!rows.length) throw new HttpError(404, 'Client not found');
    res.json({ client: rows[0] });
  }
);

router.delete('/clients/:id', requireAdmin('admin'), async (req, res) => {
  await callProc('sp_client_delete', [req.params.id]);
  res.status(204).end();
});

export default router;
