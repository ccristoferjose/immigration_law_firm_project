import { Router } from 'express';
import { z } from 'zod';
import { callProc } from '../config/db.js';
import { validate } from '../middleware/validate.js';
import { requireAdmin } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';

const router = Router();

const typeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  duration_minutes: z.coerce.number().int().min(5).max(480),
  is_active: z.boolean().optional(),
  case_prefix: z.string().min(1).max(8).optional(),
});

// Public: list active types (for booking flow)
router.get('/appointment-types/public', async (req, res) => {
  const rows = await callProc('sp_appointment_type_list', [1]);
  // Return only public-facing fields
  const types = rows.map(({ id, name, description, duration_minutes }) => ({
    id, name, description, duration_minutes,
  }));
  res.json({ types });
});

// Admin CRUD
router.get('/appointment-types', requireAdmin(), async (req, res) => {
  const rows = await callProc('sp_appointment_type_list', [0]);
  res.json({ types: rows });
});

router.post(
  '/appointment-types',
  requireAdmin(),
  validate(typeSchema),
  async (req, res) => {
    const { name, description, duration_minutes, is_active, case_prefix } = req.body;
    try {
      const rows = await callProc('sp_appointment_type_create', [
        name, description || null, duration_minutes,
        is_active !== false ? 1 : 0,
        case_prefix || 'GEN',
      ]);
      res.status(201).json({ type: rows[0] });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Type name already exists');
      throw err;
    }
  }
);

router.put(
  '/appointment-types/:id',
  requireAdmin(),
  validate(typeSchema),
  async (req, res) => {
    const { name, description, duration_minutes, is_active, case_prefix } = req.body;
    const rows = await callProc('sp_appointment_type_update', [
      req.params.id, name, description || null, duration_minutes,
      is_active !== false ? 1 : 0,
      case_prefix || null,
    ]);
    if (!rows.length) throw new HttpError(404, 'Type not found');
    res.json({ type: rows[0] });
  }
);

router.delete('/appointment-types/:id', requireAdmin('admin'), async (req, res) => {
  await callProc('sp_appointment_type_delete', [req.params.id]);
  res.status(204).end();
});

export default router;
