const mongoose = require('mongoose');

const amcPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['basic', 'premium'], required: true },
  price: { type: Number, required: true },
  duration: { type: String, default: '1 Year' },
  features: [String],
  serviceVisits: Number,
  filterReplacement: { type: Boolean, default: false },
  prioritySupport: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('AMCPlan', amcPlanSchema);
