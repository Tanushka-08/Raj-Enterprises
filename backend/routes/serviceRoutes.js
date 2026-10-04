const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');
const { validateServiceBooking, handleValidationErrors } = require('../middleware/validate');

// Public routes
router.post('/', validateServiceBooking, handleValidationErrors, serviceController.createService);
router.post('/track', serviceController.trackService);

// Protected routes (Admin only)
router.get('/', auth, serviceController.getAllServices);
router.get('/:ticketId', auth, serviceController.getServiceByTicketId);
router.put('/:id', auth, serviceController.updateService);
router.delete('/:id', auth, serviceController.deleteService);

module.exports = router;
