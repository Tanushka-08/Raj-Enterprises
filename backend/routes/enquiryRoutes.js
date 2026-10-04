const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const auth = require('../middleware/auth');
const { validateEnquiry, handleValidationErrors } = require('../middleware/validate');

// Public routes
router.post('/', validateEnquiry, handleValidationErrors, enquiryController.createEnquiry);

// Protected routes (Admin only)
router.get('/', auth, enquiryController.getAllEnquiries);
router.put('/:id', auth, enquiryController.updateEnquiry);
router.delete('/:id', auth, enquiryController.deleteEnquiry);

module.exports = router;
