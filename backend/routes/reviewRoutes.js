const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const { optionalAuth } = require('../middleware/auth');

// Public routes
// optionalAuth lets logged-in admins see unapproved reviews; guests only see approved ones
router.get('/', optionalAuth, reviewController.getAllReviews);
// Public review submission (stored as unapproved until an admin approves it)
router.post('/public', reviewController.createPublicReview);

// Protected routes (Admin only)
router.get('/:id', auth, reviewController.getReviewById);
router.post('/', auth, reviewController.createReview);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
