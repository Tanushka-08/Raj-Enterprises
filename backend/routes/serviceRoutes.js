const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');
const {
  validateServiceBooking,
  validateTicketTrack,
  handleValidationErrors
} = require('../middleware/validate');

// Public routes
router.post(
  '/',
  rateLimit({ windowMs: 10 * 60 * 1000, max: 8, message: 'Too many service requests from this device. Please call 8237739994.' }),
  validateServiceBooking,
  handleValidationErrors,
  serviceController.createService
);
router.post(
  '/track',
  rateLimit({ windowMs: 5 * 60 * 1000, max: 30, message: 'Too many tracking attempts. Please wait a few minutes.' }),
  validateTicketTrack,
  handleValidationErrors,
  serviceController.trackService
);

// Protected routes (Admin only)
router.get('/', auth, serviceController.getAllServices);
router.get('/:ticketId', auth, serviceController.getServiceByTicketId);
router.put('/:id', auth, serviceController.updateService);
router.delete('/:id', auth, serviceController.deleteService);

module.exports = router;
