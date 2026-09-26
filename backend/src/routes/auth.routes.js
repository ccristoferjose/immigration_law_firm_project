import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { callProc } from '../config/db.js';
import { validate } from '../middleware/validate.js';
import { signAdminToken } from '../utils/jwt.js';
import { requireAdmin } from '../middleware/auth.js';
import { HttpError } from '../middleware/error.js';
import { getSettingsMap } from './settings.routes.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Obscured staff login — path token must match the stored staff_login_path setting
router.post('/staff-portal/:pathToken/login', validate(loginSchema), async (req, res) => {
  const { pathToken } = req.params;
  const settings = await getSettingsMap();
  const expected = settings.staff_login_path || '';

  // Timing-safe comparison to prevent timing attacks
  if (
    !expected ||
    pathToken.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(pathToken, 'utf8'), Buffer.from(expected, 'utf8'))
  ) {
    throw new HttpError(404, 'Not found');
  }

  const { email, password } = req.body;
  const rows = await callProc('sp_user_authenticate', [email]);
  const user = rows[0];
  if (!user || !user.is_active) throw new HttpError(401, 'Invalid credentials');
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new HttpError(401, 'Invalid credentials');

  const token = signAdminToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    },
  });
});

router.get('/admin/me', requireAdmin(), async (req, res) => {
  res.json({ user: req.user });
});

// Admin creates additional staff users
const createStaffSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  role: z.enum(['admin', 'lawyer', 'assistant']),
});

router.post(
  '/admin/users',
  requireAdmin('admin'),
  validate(createStaffSchema),
  async (req, res) => {
    const { email, password, full_name, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
      const rows = await callProc('sp_user_create', [email, hash, full_name, role]);
      const user = rows[0];
      res.status(201).json({ id: user.id, email: user.email, full_name: user.full_name, role: user.role });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new HttpError(409, 'A user with that email already exists');
      }
      throw err;
    }
  }
);

router.get('/admin/users', requireAdmin('admin'), async (req, res) => {
  const rows = await callProc('sp_user_list', []);
  res.json({ users: rows });
});

export default router;
