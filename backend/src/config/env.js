import dotenv from 'dotenv';
dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'legal',
    password: process.env.DB_PASSWORD || 'legalpass',
    database: process.env.DB_NAME || 'legal_appt',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '12h',
  },

  firebase: {
    serviceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      'http://localhost:4000/api/google/oauth/callback',
  },

  bootstrapAdmin: {
    email: process.env.BOOTSTRAP_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.BOOTSTRAP_ADMIN_PASSWORD || 'admin123',
    fullName: process.env.BOOTSTRAP_ADMIN_NAME || 'Default Admin',
  },
};
