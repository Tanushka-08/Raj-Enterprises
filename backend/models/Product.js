const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: String,
  category: { 
    type: String, 
    enum: ['domestic-ro', 'uv-purifier'], 
    default: 'domestic-ro' 
  },
  description: String,
  shortDescription: String,
  variants: [{
    variantName: String,
    colorName: String,
    colorCode: String,
    image: String,
    sku: String
  }],
  price: { type: Number, required: true },
  mrp: Number,
  offerPrice: Number,
  hasOffer: { type: Boolean, default: false },
  storage: String,
  technology: String,
  filtrationStages: Number,
  filters: [String],
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  warranty: { type: String, default: '1 Year Warranty' },
  certifications: [String],
  features: [String],
  purificationType: [String],
  flowRate: String,
  inputTDS: String,
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
