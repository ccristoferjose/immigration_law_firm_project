import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import {
  getAuthUrl,
  exchangeCode,
  saveTokensForUser,
  loadTokensForUser,
  googleConfigured,
} from '../services/google.service.js';
import { HttpError } from '../middleware/error.js';

const router = Router();

router.get('/google/status', requireAdmin(), async (req, res) => {
  if (!googleConfigured()) return res.json({ configured: false, connected: false });
  const row = await loadTokensForUser(req.user.id);
  res.json({
    configured: true,
    connected: !!(row && row.refresh_token),
    calendar_id: row?.calendar_id || 'primary',
  });
});

router.get('/google/oauth/start', requireAdmin(), (req, res) => {
  if (!googleConfigured()) throw new HttpError(400, 'Google OAuth not configured on server');
  const state = Buffer.from(
    JSON.stringify({ uid: req.user.id, t: Date.now() })
  ).toString('base64url');
  const url = getAuthUrl(state);
  res.json({ url });
});

router.get('/google/oauth/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) return res.status(400).send('Missing code/state');
  let uid;
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    uid = decoded.uid;
  } catch {
    return res.status(400).send('Invalid state');
  }
  try {
    const tokens = await exchangeCode(code.toString());
    await saveTokensForUser(uid, tokens);
    const redirect = `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/admin/settings?google=connected`;
    res.redirect(redirect);
  } catch (err) {
    console.error('[google] oauth callback error', err);
    res.status(500).send('OAuth exchange failed');
  }
});

export default router;
