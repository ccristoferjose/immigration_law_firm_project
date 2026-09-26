import { Router } from 'express';
import { z } from 'zod';
import { callProc } from '../config/db.js';
import { validate } from '../middleware/validate.js';
import { requireAdmin, requireClient, requireVerifiedClient } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { assertSlotAvailable } from '../services/availability.service.js';
import { createMeetEvent, deleteMeetEvent } from '../services/google.service.js';

const router = Router();

// ---------- Schemas ----------
const modalityEnum = z.enum(['in_person', 'google_meet']);
const statusEnum = z.enum(['pending_review', 'scheduled', 'completed', 'cancelled', 'no_show', 'rejected']);

const adminCreateSchema = z.object({
  client_id: z.coerce.number().int(),
  appointment_type_id: z.coerce.number().int(),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  modality: modalityEnum,
  notes: z.string().optional().nullable(),
  staff_notes: z.string().optional().nullable(),
  status: z.enum(['scheduled', 'pending_review']).optional().default('scheduled'),
});

const adminUpdateSchema = z.object({
  client_id: z.coerce.number().int().optional(),
  appointment_type_id: z.coerce.number().int().optional(),
  start_at: z.string().datetime().optional(),
  end_at: z.string().datetime().optional(),
  modality: modalityEnum.optional(),
  notes: z.string().optional().nullable(),
  staff_notes: z.string().optional().nullable(),
  status: statusEnum.optional(),
});

const publicCreateSchema = z.object({
  appointment_type_id: z.coerce.number().int(),
  start_at: z.string().datetime(),
  modality: modalityEnum,
  notes: z.string().optional().nullable(),
  preferred_contact_time: z.string().optional().nullable(),
});

const reviewSchema = z.object({
  action: z.enum(['approve', 'reject']),
  review_notes: z.string().optional().nullable(),
});

// ---------- Admin: list ----------
router.get('/appointments', requireAdmin(), async (req, res) => {
  const { from, to, status, client_id } = req.query;
  const rows = await callProc('sp_appointment_list', [
    from ? new Date(from) : null,
    to ? new Date(to) : null,
    status || null,
    client_id ? parseInt(client_id) : null,
  ]);
  res.json({ appointments: rows });
});

router.get('/appointments/pending-review', requireAdmin('admin', 'assistant'), async (req, res) => {
  const rows = await callProc('sp_appointment_list_pending_review', []);
  res.json({ appointments: rows });
});

router.get('/appointments/:id', requireAdmin(), async (req, res) => {
  const rows = await callProc('sp_appointment_get', [req.params.id]);
  if (!rows.length) throw new HttpError(404, 'Appointment not found');
  res.json({ appointment: rows[0] });
});

// ---------- Admin: create ----------
router.post(
  '/appointments',
  requireAdmin(),
  validate(adminCreateSchema),
  async (req, res) => {
    const { client_id, appointment_type_id, start_at, end_at, modality, notes, staff_notes, status } = req.body;

    const typeRows = await callProc('sp_appointment_type_get', [appointment_type_id]);
    if (!typeRows.length || !typeRows[0].is_active) throw new HttpError(400, 'Invalid appointment type');

    const clientRows = await callProc('sp_client_get_by_id', [client_id]);
    if (!clientRows.length) throw new HttpError(400, 'Invalid client');

    try {
      await assertSlotAvailable(start_at, end_at);
    } catch (err) {
      throw new HttpError(409, err.message);
    }

    let meetLink = null;
    let eventId = null;
    let googleMeetError = null;
    if (modality === 'google_meet') {
      try {
        const result = await createMeetEvent({
          userId: req.user.id,
          summary: `${typeRows[0].name} — ${clientRows[0].full_name}`,
          description: notes || '',
          startIso: start_at,
          endIso: end_at,
          attendees: [clientRows[0].email],
        });
        if (result) {
          meetLink = result.meetLink;
          eventId = result.eventId;
        } else {
          googleMeetError = 'Google Calendar not connected — appointment saved without Meet link.';
        }
      } catch (err) {
        googleMeetError = err.message;
        console.warn('[google] Meet creation failed, saving appointment without link:', err.message);
      }
    }

    const rows = await callProc('sp_appointment_create', [
      client_id, appointment_type_id,
      new Date(start_at), new Date(end_at),
      status || 'scheduled', modality, meetLink, eventId,
      notes || null, staff_notes || null,
      'admin', req.user.id, null,
    ]);
    res.status(201).json({ appointment: rows[0], googleMeetError });
  }
);

// ---------- Admin: update ----------
router.put(
  '/appointments/:id',
  requireAdmin(),
  validate(adminUpdateSchema),
  async (req, res) => {
    const id = req.params.id;
    const existing = await callProc('sp_appointment_get', [id]);
    if (!existing.length) throw new HttpError(404, 'Appointment not found');
    const prev = existing[0];

    const merged = {
      client_id: req.body.client_id ?? prev.client_id,
      appointment_type_id: req.body.appointment_type_id ?? prev.appointment_type_id,
      start_at: req.body.start_at ?? prev.start_at.toISOString(),
      end_at: req.body.end_at ?? prev.end_at.toISOString(),
      modality: req.body.modality ?? prev.modality,
      notes: req.body.notes ?? prev.notes,
      staff_notes: req.body.staff_notes ?? prev.staff_notes,
      status: req.body.status ?? prev.status,
    };

    if (req.body.start_at || req.body.end_at) {
      try {
        await assertSlotAvailable(merged.start_at, merged.end_at, { excludeAppointmentId: id });
      } catch (err) {
        throw new HttpError(409, err.message);
      }
    }

    const rows = await callProc('sp_appointment_update', [
      id, merged.client_id, merged.appointment_type_id,
      new Date(merged.start_at), new Date(merged.end_at),
      merged.modality, merged.notes, merged.staff_notes, merged.status,
    ]);
    res.json({ appointment: rows[0] });
  }
);

// ---------- Admin: delete ----------
router.delete('/appointments/:id', requireAdmin(), async (req, res) => {
  const rows = await callProc('sp_appointment_get', [req.params.id]);
  if (!rows.length) return res.status(204).end();
  const appt = rows[0];
  if (appt.google_event_id && appt.created_by_user_id) {
    await deleteMeetEvent({ userId: appt.created_by_user_id, eventId: appt.google_event_id });
  }
  await callProc('sp_appointment_delete', [req.params.id]);
  res.status(204).end();
});

// ---------- Admin/Assistant: review pending appointment ----------
router.post(
  '/appointments/:id/review',
  requireAdmin('admin', 'assistant'),
  validate(reviewSchema),
  async (req, res) => {
    const id = req.params.id;
    const { action, review_notes } = req.body;

    // Verify appointment exists and is pending
    const existing = await callProc('sp_appointment_get', [id]);
    if (!existing.length) throw new HttpError(404, 'Appointment not found');
    if (existing[0].status !== 'pending_review') {
      throw new HttpError(400, 'Appointment is not pending review');
    }

    // Execute review
    const rows = await callProc('sp_appointment_review', [
      id, action, req.user.id, review_notes || null,
    ]);
    const appointment = rows[0];

    let caseNumber = null;

    if (action === 'approve') {
      // Generate case number if client doesn't have one
      const clientRows = await callProc('sp_client_get_by_id', [appointment.client_id]);
      if (clientRows.length && !clientRows[0].case_number) {
        const cnRows = await callProc('sp_generate_case_number', [
          appointment.client_id, appointment.appointment_type_id,
        ]);
        caseNumber = cnRows[0]?.case_number || null;
      } else if (clientRows.length) {
        caseNumber = clientRows[0].case_number;
      }

      // Create Google Meet event if modality requires it
      if (appointment.modality === 'google_meet' && !appointment.google_meet_link) {
        const hostRows = await callProc('sp_google_token_find_admin_host', []);
        if (hostRows.length) {
          try {
            const result = await createMeetEvent({
              userId: hostRows[0].id,
              summary: `${appointment.type_name} — ${appointment.client_name}`,
              description: appointment.notes || '',
              startIso: appointment.start_at.toISOString(),
              endIso: appointment.end_at.toISOString(),
              attendees: [appointment.client_email],
            });
            if (result) {
              // Update the appointment with Meet link
              await callProc('sp_appointment_update', [
                id, appointment.client_id, appointment.appointment_type_id,
                appointment.start_at, appointment.end_at,
                appointment.modality, appointment.notes, appointment.staff_notes,
                'scheduled',
              ]);
              appointment.google_meet_link = result.meetLink;
              appointment.google_event_id = result.eventId;
            }
          } catch (err) {
            appointment.googleMeetError = err.message;
            console.warn('[google] Meet creation on approval failed:', err.message);
          }
        } else {
          appointment.googleMeetError = 'No admin has connected Google Calendar — Meet link skipped.';
        }
      }
    }

    res.json({ appointment, case_number: caseNumber, googleMeetError: appointment.googleMeetError || null });
  }
);

// ---------- Public (client) booking ----------
// requireVerifiedClient enforces: valid Firebase token + at least one of
// (email_verified, phone_number) claims present.
router.post('/appointments/book', ...requireVerifiedClient, async (req, res) => {
  const parsed = publicCreateSchema.safeParse(req.body);
  if (!parsed.success) throw new HttpError(400, 'Invalid booking payload', parsed.error.flatten());

  if (!req.clientRecord) {
    throw new HttpError(400, 'No client profile found — please complete registration first');
  }

  const { appointment_type_id, start_at, modality, notes, preferred_contact_time } = parsed.data;

  const typeRows = await callProc('sp_appointment_type_get', [appointment_type_id]);
  if (!typeRows.length || !typeRows[0].is_active) throw new HttpError(400, 'Invalid appointment type');
  const type = typeRows[0];

  const start = new Date(start_at);
  const end = new Date(start.getTime() + type.duration_minutes * 60 * 1000);

  try {
    await assertSlotAvailable(start.toISOString(), end.toISOString());
  } catch (err) {
    throw new HttpError(409, err.message);
  }

  // Fast-path rule: skip review iff returning, verified, existing client with a bound case.
  const hasVerification = req.verification.emailVerified || req.verification.phoneVerified;
  const isExistingVerified =
    req.clientRecord.client_type === 'existing' &&
    req.clientRecord.case_number &&
    hasVerification;
  const status = isExistingVerified ? 'scheduled' : 'pending_review';

  let meetLink = null;
  let eventId = null;
  let hostUserId = null;
  let googleMeetError = null;

  if (modality === 'google_meet' && isExistingVerified) {
    const hostRows = await callProc('sp_google_token_find_admin_host', []);
    if (hostRows.length) {
      hostUserId = hostRows[0].id;
      try {
        const result = await createMeetEvent({
          userId: hostUserId,
          summary: `${type.name} — ${req.clientRecord.full_name}`,
          description: notes || '',
          startIso: start.toISOString(),
          endIso: end.toISOString(),
          attendees: [req.clientRecord.email],
        });
        if (result) {
          meetLink = result.meetLink;
          eventId = result.eventId;
        } else {
          googleMeetError = 'Google Calendar not connected — your appointment is saved without a Meet link.';
        }
      } catch (err) {
        googleMeetError = err.message;
        console.warn('[google] public Meet creation failed:', err.message);
      }
    }
  }

  const rows = await callProc('sp_appointment_create', [
    req.clientRecord.id, type.id,
    start, end, status, modality,
    meetLink, eventId, notes || null, null,
    'public', hostUserId, preferred_contact_time || null,
  ]);
  res.status(201).json({ appointment: rows[0], googleMeetError });
});

// Client: list own appointments (split into upcoming vs past)
router.get('/appointments/mine/list', requireClient, async (req, res) => {
  if (!req.clientRecord) return res.json({ upcoming: [], past: [] });
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
  res.json({ upcoming, past });
});

export default router;
