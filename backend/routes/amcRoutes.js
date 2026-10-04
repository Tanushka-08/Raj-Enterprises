const express = require('express');
const router = express.Router();
const amcController = require('../controllers/amcController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', amcController.getAllAMCPlans);
router.get('/:id', amcController.getAMCPlanById);

// Protected routes (Admin only)
router.post('/', auth, amcController.createAMCPlan);
router.put('/:id', auth, amcController.updateAMCPlan);
router.delete('/:id', auth, amcController.deleteAMCPlan);

module.exports = router;
