const mongoose = require('mongoose');

const serviceTicketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: String,
  flat: String,
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  customerType: { 
    type: String, 
    enum: ['residential', 'commercial', 'office'], 
    default: 'residential' 
  },
  serviceType: { 
    type: String, 
    required: true, 
    enum: ['RO Installation', 'RO Repair', 'RO Servicing', 'AMC', 'Filter Replacement', 'Water Treatment', 'Water Testing', 'Other'] 
  },
  preferredDate: Date,
  message: String,
  status: { 
    type: String, 
    enum: ['Request Logged', 'Technician Assigned', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Request Logged' 
  },
  technicianName: String,
  adminNotes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceTicket', serviceTicketSchema);
