import { fromZonedTime, toZonedTime, format as formatTz } from 'date-fns-tz';
import { addDays, addMinutes, startOfDay } from 'date-fns';
import { callProc } from '../config/db.js';
import { getSettingsMap } from '../routes/settings.routes.js';

/**
 * Compute available slots for a given date (in business timezone), given a
 * desired slot duration (defaults to the configured business slot duration).
 */
export async function getAvailableSlots(dateIso, durationMinutesOverride) {
  const s = await getSettingsMap();
  const tz = s.timezone || 'UTC';
  const workingDays = (s.working_days || '1,2,3,4,5')
    .split(',')
    .map((d) => parseInt(d.trim(), 10));
  const [whStartH, whStartM] = (s.working_hours_start || '10:00').split(':').map(Number);
  const [whEndH, whEndM] = (s.working_hours_end || '17:00').split(':').map(Number);
  const slotDuration =
    durationMinutesOverride || parseInt(s.slot_duration_minutes || '60', 10);
  const buffer = parseInt(s.buffer_minutes || '0', 10);
  const windowDays = parseInt(s.booking_window_days || '30', 10);

  // Parse date as midnight in business tz -> UTC Date
  const [y, m, d] = dateIso.split('-').map(Number);
  const localDayStart = fromZonedTime(
    `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T00:00:00`,
    tz
  );

  // Booking window check
  const nowUtc = new Date();
  const maxUtc = addDays(startOfDay(nowUtc), windowDays);
  if (localDayStart > maxUtc) return [];

  // Day of week in business tz
  const localDate = toZonedTime(localDayStart, tz);
  const dow = localDate.getDay();
  if (!workingDays.includes(dow)) return [];

  // Working hours start/end as UTC instants
  const startLocalIso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(whStartH).padStart(2, '0')}:${String(whStartM).padStart(2, '0')}:00`;
  const endLocalIso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(whEndH).padStart(2, '0')}:${String(whEndM).padStart(2, '0')}:00`;
  const dayStartUtc = fromZonedTime(startLocalIso, tz);
  const dayEndUtc = fromZonedTime(endLocalIso, tz);

  // Fetch appointments and blocked times overlapping the day via stored procedures
  const appts = await callProc('sp_availability_get_appointments', [dayStartUtc, dayEndUtc]);
  const blocked = await callProc('sp_availability_get_blocked', [dayStartUtc, dayEndUtc]);

  const busy = [
    ...appts.map((a) => ({
      start: addMinutes(new Date(a.start_at), -buffer),
      end: addMinutes(new Date(a.end_at), buffer),
    })),
    ...blocked.map((b) => ({ start: new Date(b.start_at), end: new Date(b.end_at) })),
  ];

  const slots = [];
  let cursor = new Date(dayStartUtc);
  while (addMinutes(cursor, slotDuration) <= dayEndUtc) {
    const slotStart = new Date(cursor);
    const slotEnd = addMinutes(slotStart, slotDuration);

    // Skip past slots
    if (slotStart < nowUtc) {
      cursor = addMinutes(cursor, slotDuration);
      continue;
    }

    const overlaps = busy.some(
      (b) => slotStart < b.end && slotEnd > b.start
    );
    if (!overlaps) {
      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        local_label: formatTz(toZonedTime(slotStart, tz), 'HH:mm', { timeZone: tz }),
      });
    }
    cursor = addMinutes(cursor, slotDuration);
  }
  return slots;
}

/**
 * Check if [start, end] is a valid, conflict-free slot.
 * Throws with a descriptive message if not.
 */
export async function assertSlotAvailable(startIso, endIso, { excludeAppointmentId } = {}) {
  const s = await getSettingsMap();
  const tz = s.timezone || 'UTC';
  const workingDays = (s.working_days || '1,2,3,4,5')
    .split(',')
    .map((d) => parseInt(d.trim(), 10));
  const [whStartH, whStartM] = (s.working_hours_start || '10:00').split(':').map(Number);
  const [whEndH, whEndM] = (s.working_hours_end || '17:00').split(':').map(Number);
  const buffer = parseInt(s.buffer_minutes || '0', 10);
  const windowDays = parseInt(s.booking_window_days || '30', 10);

  const start = new Date(startIso);
  const end = new Date(endIso);

  if (!(end > start)) throw new Error('End time must be after start time');
  if (start < new Date()) throw new Error('Cannot book a time in the past');

  const maxUtc = addDays(startOfDay(new Date()), windowDays + 1);
  if (start > maxUtc) throw new Error(`Booking window limited to ${windowDays} days ahead`);

  // Business-tz day-of-week
  const local = toZonedTime(start, tz);
  const dow = local.getDay();
  if (!workingDays.includes(dow)) throw new Error('Selected day is not a working day');

  // Must be within working hours on that day
  const y = local.getFullYear();
  const m = local.getMonth() + 1;
  const d = local.getDate();
  const dayStartUtc = fromZonedTime(
    `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(whStartH).padStart(2, '0')}:${String(whStartM).padStart(2, '0')}:00`,
    tz
  );
  const dayEndUtc = fromZonedTime(
    `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}T${String(whEndH).padStart(2, '0')}:${String(whEndM).padStart(2, '0')}:00`,
    tz
  );
  if (start < dayStartUtc || end > dayEndUtc) {
    throw new Error('Time is outside business working hours');
  }

  // Conflicts (with buffer) via stored procedure
  const startBuf = addMinutes(start, -buffer);
  const endBuf = addMinutes(end, buffer);

  const conflicts = await callProc('sp_availability_check_conflicts', [
    startBuf, endBuf, excludeAppointmentId || null,
  ]);
  if (conflicts.length) throw new Error('Time slot conflicts with an existing appointment');

  const blockedConflicts = await callProc('sp_availability_check_blocked', [start, end]);
  if (blockedConflicts.length) throw new Error('Time slot falls within a blocked period');
}
