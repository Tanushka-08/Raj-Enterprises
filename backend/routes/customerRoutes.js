const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');
const { validateCustomer, handleValidationErrors } = require('../middleware/validate');

// Public route (customer self-creation), spam-limited
router.post(
  '/',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: 'Too many requests from this device. Please try again later.' }),
  validateCustomer,
  handleValidationErrors,
  customerController.createCustomer
);

// Protected routes (Admin only)
router.get('/', auth, customerController.getAllCustomers);
router.get('/:id', auth, customerController.getCustomerById);
router.put('/:id', auth, customerController.updateCustomer);
router.delete('/:id', auth, customerController.deleteCustomer);

module.exports = router;
