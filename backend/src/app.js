import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { csrfSync } from 'csrf-sync';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import projectRoutes from './routes/project.routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// 1. Helmet HTTP Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows static asset & avatar loading across ports
  })
);

// 2. CORS setup
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

// 3. Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 4. Mongo Sanitize middleware against NoSQL injection
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    mongoSanitize.sanitize(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    mongoSanitize.sanitize(req.params);
  }
  next();
});

// 5. CSRF Token Endpoint & Protection
import crypto from 'crypto';

app.get('/api/csrf-token', (req, res) => {
  const token = crypto.randomBytes(32).toString('hex');
  res.json({ csrfToken: token });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
