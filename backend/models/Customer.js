const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: String,
  flat: String,
  address: String,
  pincode: String,
  customerType: { 
    type: String, 
    enum: ['residential', 'commercial', 'office'], 
    default: 'residential' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
