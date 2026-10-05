const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');
const { validateEnquiry, handleValidationErrors } = require('../middleware/validate');

// Public routes
router.post(
  '/',
  rateLimit({ windowMs: 10 * 60 * 1000, max: 10, message: 'Too many enquiries from this device. Please try again later or call 8237739994.' }),
  validateEnquiry,
  handleValidationErrors,
  enquiryController.createEnquiry
);

// Protected routes (Admin only)
router.get('/', auth, enquiryController.getAllEnquiries);
router.put('/:id', auth, enquiryController.updateEnquiry);
router.delete('/:id', auth, enquiryController.deleteEnquiry);

module.exports = router;
