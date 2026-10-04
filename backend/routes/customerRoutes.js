const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');

// Public routes (for customer self-creation via enquiry/service if needed)
router.post('/', customerController.createCustomer);

// Protected routes (Admin only)
router.get('/', auth, customerController.getAllCustomers);
router.get('/:id', auth, customerController.getCustomerById);
router.put('/:id', auth, customerController.updateCustomer);
router.delete('/:id', auth, customerController.deleteCustomer);

module.exports = router;
