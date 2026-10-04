const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  isApproved: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
