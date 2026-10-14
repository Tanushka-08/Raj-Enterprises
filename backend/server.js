const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const rateLimit = require('./middleware/rateLimit');

// Route files
const productRoutes = require('./routes/productRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const amcRoutes = require('./routes/amcRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const customerRoutes = require('./routes/customerRoutes');

// Demo export for Experiment 7
const { runDemo } = require('./utils/nodeDemo');

dotenv.config();

connectDB();

const app = express();

// Behind a proxy/load balancer in production so req.ip and CORS see the real client
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Security and utility middlewares
const CSP_SOURCES = [
  "'self'",
  "'unsafe-inline'",
  'https://cdn.jsdelivr.net',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'data:',
  'blob:'
].join(' ');

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        // Bootstrap bundle + Google Fonts are served from jsdelivr/fonts CDN
        scriptSrc: CSP_SOURCES,
        styleSrc: CSP_SOURCES,
        fontSrc: CSP_SOURCES,
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: [
          "'self'",
          'https://*.onrender.com',
          'https://*.vercel.app',
          ...(process.env.CLIENT_URL || '')
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean)
        ],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
        upgradeInsecureRequests: null
      }
    },
    // The site has no user documents/PDFs; lock down the risky embedders
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  })
);

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin / non-browser requests and production hosting domains
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.includes('onrender.com') ||
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Health check (also reports database connectivity)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Broad ceiling on the public API surface, on top of the per-route limits
app.use('/api', rateLimit({ windowMs: 60 * 1000, max: 300, message: 'Too many requests. Please slow down.' }));

// Mount routers
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/amc', amcRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/customers', customerRoutes);

// Unknown API route -> JSON 404 (never the SPA fallback)
app.use('/api', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Serve the built React app in production (single-service deployment)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath, { maxAge: '7d', index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);

  // Run the Node.js fundamentals demo (Experiment 7) with: npm run demo
  // runDemo();
});

// Close the HTTP server cleanly so nodemon restarts do not leak handles
const shutdown = (signal) => () => {
  console.log(`${signal} received, shutting down`);
  server.close(() => mongoose.connection.close(false).then(() => process.exit(0)));
};
process.on('SIGINT', shutdown('SIGINT'));
process.on('SIGTERM', shutdown('SIGTERM'));

module.exports = app;
