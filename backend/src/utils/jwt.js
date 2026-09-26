import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAdminToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role, kind: 'admin' },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

export function verifyAdminToken(token) {
  return jwt.verify(token, env.jwt.secret);
}
