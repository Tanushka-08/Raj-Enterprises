const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
// auth.js exports the middleware function itself and hangs optionalAuth off it
const auth = require('../middleware/auth');
const { optionalAuth } = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');
const { validatePublicReview, handleValidationErrors } = require('../middleware/validate');

// Public routes
// optionalAuth lets logged-in admins see unapproved reviews; guests only see approved ones
router.get('/', optionalAuth, reviewController.getAllReviews);
// Public review submission (stored as unapproved until an admin approves it)
router.post(
  '/public',
  rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: 'You have already submitted reviews recently. Thank you!' }),
  validatePublicReview,
  handleValidationErrors,
  reviewController.createPublicReview
);

// Protected routes (Admin only)
router.get('/:id', auth, reviewController.getReviewById);
router.post('/', auth, reviewController.createReview);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
