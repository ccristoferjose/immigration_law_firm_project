import { Router } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { callProc } from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

const SETTING_KEYS = [
  'business_name',
  'business_tagline',
  'timezone',
  'working_days',
  'working_hours_start',
  'working_hours_end',
  'slot_duration_minutes',
  'buffer_minutes',
  'booking_window_days',
  'staff_login_path',
];

export async function getSettingsMap() {
  const rows = await callProc('sp_setting_get_all', []);
  const map = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

// Public settings (what a landing page / booking flow needs)
router.get('/settings/public', async (req, res) => {
  const all = await getSettingsMap();
  res.json({
    business_name: all.business_name,
    business_tagline: all.business_tagline,
    timezone: all.timezone,
    booking_window_days: parseInt(all.booking_window_days || '30', 10),
    slot_duration_minutes: parseInt(all.slot_duration_minutes || '60', 10),
    working_hours_start: all.working_hours_start || '10:00',
    working_hours_end: all.working_hours_end || '17:00',
  });
});

// Admin full settings
router.get('/settings', requireAdmin(), async (req, res) => {
  const map = await getSettingsMap();
  res.json({ settings: map });
});

const updateSchema = z.record(z.string(), z.string());

router.put('/settings', requireAdmin('admin'), async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid settings' });

  for (const [key, value] of Object.entries(parsed.data)) {
    if (!SETTING_KEYS.includes(key)) continue;
    await callProc('sp_setting_upsert', [key, String(value)]);
  }
  const map = await getSettingsMap();
  res.json({ settings: map });
});

// Staff login path — admin can view and regenerate
router.get('/settings/staff-login-path', requireAdmin('admin'), async (req, res) => {
  const map = await getSettingsMap();
  res.json({ path: map.staff_login_path || '' });
});

router.post('/settings/regenerate-staff-path', requireAdmin('admin'), async (req, res) => {
  const newPath = crypto.randomBytes(12).toString('hex');
  await callProc('sp_setting_upsert', ['staff_login_path', newPath]);
  res.json({ path: newPath });
});

export default router;
