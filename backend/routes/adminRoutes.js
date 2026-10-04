const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Public routes
router.post('/login', adminController.login);

// Protected routes (Admin only)
router.get('/dashboard', auth, adminController.getDashboard);
router.post('/register', auth, adminController.register);

module.exports = router;
