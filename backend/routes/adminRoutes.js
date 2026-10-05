const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

// Public routes
// Brute-force protection: only failed attempts count toward the limit
router.post(
  '/login',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8,
    skipSuccessful: true,
    message: 'Too many failed login attempts. Please try again in 15 minutes.'
  }),
  adminController.login
);

// Protected routes (Admin only)
router.get('/dashboard', auth, adminController.getDashboard);
router.post('/register', auth, adminController.register);

module.exports = router;
