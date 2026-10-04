const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  enquiryId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: String,
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  message: String,
  source: { 
    type: String, 
    enum: ['product-page', 'contact', 'whatsapp', 'other'], 
    default: 'product-page' 
  },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'converted', 'closed'], 
    default: 'new' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Enquiry', enquirySchema);
