const mongoose = require('mongoose');
const { TICKET_STATUSES } = require('../utils/ticketStatus');

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
    enum: TICKET_STATUSES,
    default: 'Request Logged'
  },
  technicianName: String,
  adminNotes: String,
  // Real, append-only audit trail of every status change. The public tracker
  // animates from this array, so the progress shown is never invented.
  statusHistory: [{
    status: { type: String, enum: TICKET_STATUSES },
    note: String,
    technicianName: String,
    changedBy: String,
    at: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('ServiceTicket', serviceTicketSchema);
