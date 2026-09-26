import { Router } from 'express';
import { z } from 'zod';
import { callProc } from '../config/db.js';
import { validate } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';

const router = Router();

const schema = z.object({
  title: z.string().min(1),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  reason: z.string().optional().nullable(),
});

router.get('/blocked-times', requireAdmin(), async (req, res) => {
  const { from, to } = req.query;
  const rows = await callProc('sp_blocked_time_list', [
    from ? new Date(from) : null,
    to ? new Date(to) : null,
  ]);
  res.json({ blocked: rows });
});

router.post(
  '/blocked-times',
  requireAdmin(),
  validate(schema),
  async (req, res) => {
    const { title, start_at, end_at, reason } = req.body;
    if (new Date(end_at) <= new Date(start_at))
      throw new HttpError(400, 'end_at must be after start_at');
    const rows = await callProc('sp_blocked_time_create', [
      title, new Date(start_at), new Date(end_at), reason || null,
    ]);
    res.status(201).json({ blocked: rows[0] });
  }
);

router.put(
  '/blocked-times/:id',
  requireAdmin(),
  validate(schema),
  async (req, res) => {
    const { title, start_at, end_at, reason } = req.body;
    const rows = await callProc('sp_blocked_time_update', [
      req.params.id, title, new Date(start_at), new Date(end_at), reason || null,
    ]);
    if (!rows.length) throw new HttpError(404, 'Blocked time not found');
    res.json({ blocked: rows[0] });
  }
);

router.delete('/blocked-times/:id', requireAdmin(), async (req, res) => {
  await callProc('sp_blocked_time_delete', [req.params.id]);
  res.status(204).end();
});

export default router;
