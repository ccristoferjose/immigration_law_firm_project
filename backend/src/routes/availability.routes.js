import { Router } from 'express';
import { getAvailableSlots } from '../services/availability.service.js';
import { HttpError } from '../middleware/error.js';

const router = Router();

// GET /api/availability?date=YYYY-MM-DD&duration=60
router.get('/availability', async (req, res) => {
  const date = (req.query.date || '').toString();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new HttpError(400, 'date query param must be YYYY-MM-DD');
  }
  const duration = req.query.duration ? parseInt(req.query.duration, 10) : undefined;
  const slots = await getAvailableSlots(date, duration);
  res.json({ date, slots });
});

export default router;
