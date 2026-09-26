import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'express-async-errors';

import { env } from './config/env.js';
import { notFound, errorHandler } from './middleware/error.js';
import { firebaseDiagnostic } from './utils/firebase.js';

import authRoutes from './routes/auth.routes.js';
import clientsRoutes from './routes/clients.routes.js';
import appointmentTypesRoutes from './routes/appointmentTypes.routes.js';
import blockedTimesRoutes from './routes/blockedTimes.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import availabilityRoutes from './routes/availability.routes.js';
import appointmentsRoutes from './routes/appointments.routes.js';
import googleRoutes from './routes/google.routes.js';

export function createApp() {
  const app = express();

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(
    cors({
      origin: env.corsOrigin.split(',').map((s) => s.trim()),
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
  app.get('/api/debug/firebase', (req, res) => res.json(firebaseDiagnostic()));

  app.use('/api', authRoutes);
  app.use('/api', clientsRoutes);
  app.use('/api', appointmentTypesRoutes);
  app.use('/api', blockedTimesRoutes);
  app.use('/api', settingsRoutes);
  app.use('/api', availabilityRoutes);
  app.use('/api', appointmentsRoutes);
  app.use('/api', googleRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
