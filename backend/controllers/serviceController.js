const ServiceTicket = require('../models/ServiceTicket');
const Customer = require('../models/Customer');
const { generateTicketId } = require('../utils/generateTicketId');
const { TICKET_STATUSES } = require('../utils/ticketStatus');

// Customers type their number in many ways on a booking form ("9876543210",
// "09876543210", "+91 98765 43210"). Tracking must still find the ticket, so
// both the stored and the submitted number are reduced to the same 10 digits.
const normaliseMobile = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
};

// Never trust a client-supplied status/ticketId: a public booking POST could
// otherwise create a ticket that is already marked "Completed".
const stripClientControlledFields = (body = {}) => {
  const { status, statusHistory, ticketId, technicianName, adminNotes, ...safe } = body;
  return safe;
};

const HISTORY_NOTES = {
  'Request Logged': 'Request received and registered',
  'Technician Assigned': 'Technician assigned for the visit',
  'In Progress': 'Service work in progress',
  'Completed': 'Service completed',
  'Cancelled': 'Request cancelled'
};

exports.getAllServices = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && TICKET_STATUSES.includes(status)) query.status = status;

    const services = await ServiceTicket.find(query).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceByTicketId = async (req, res) => {
  try {
    const ticketId = String(req.params.ticketId || '').trim().toUpperCase();
    const service = await ServiceTicket.findOne({ ticketId });
    if (!service) return res.status(404).json({ message: 'Service ticket not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackService = async (req, res) => {
  try {
    const ticketId = String(req.body.ticketId || '').trim().toUpperCase();
    const mobile = normaliseMobile(req.body.mobile);

    if (!ticketId || !mobile) {
      return res.status(400).json({ message: 'Ticket ID and mobile number are required' });
    }

    // Ticket IDs are generated upper-case, so an upper-cased exact match is enough.
// (An anchored case-insensitive regex would also work, but it cannot use the
// ticketId index and turns a lookup into a collection scan.)
const service = await ServiceTicket.findOne({ ticketId, mobile });

    if (!service) return res.status(404).json({ message: 'Ticket not found or mobile number mismatch' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const mobile = normaliseMobile(req.body.mobile);
    const ticketId = generateTicketId();

    const newService = new ServiceTicket({
      ...stripClientControlledFields(req.body),
      mobile,
      ticketId,
      status: 'Request Logged',
      // Start the real audit trail with the initial status
      statusHistory: [{
        status: 'Request Logged',
        note: HISTORY_NOTES['Request Logged'],
        changedBy: 'customer',
        at: new Date()
      }]
    });

    const savedService = await newService.save();

    // Create the customer record on first booking, refresh their details after.
    // This is a convenience mirror of the ticket, so a failure here must not
    // turn a successful booking into a 500 (the visitor would retry and end up
    // with two tickets).
    try {
      const existingCustomer = await Customer.findOne({ mobile });
      if (!existingCustomer) {
        await Customer.create({
          name: req.body.customerName,
          mobile,
          email: req.body.email,
          flat: req.body.flat,
          address: req.body.address,
          pincode: req.body.pincode,
          customerType: req.body.customerType
        });
      } else {
        const patch = { address: req.body.address, pincode: req.body.pincode };
        if (req.body.email) patch.email = req.body.email;
        if (req.body.customerType) patch.customerType = req.body.customerType;
        await Customer.updateOne({ _id: existingCustomer._id }, { $set: patch });
      }
    } catch (customerError) {
      console.error(`[service] customer mirror failed for ticket ${savedService.ticketId}:`, customerError.message);
    }

    res.status(201).json(savedService);
  } catch (error) {
    // Only schema/cast problems are the caller's fault; anything else (e.g. DB down) is a server error
    const status = error.name === 'ValidationError' || error.name === 'CastError' || error.code === 11000 ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const ticket = await ServiceTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Service ticket not found' });

    const { status, technicianName, adminNotes } = req.body;

    // Only assign fields that were actually sent, so a partial update never
    // wipes an existing technician name or note.
    if (status !== undefined && status !== ticket.status) {
      if (!TICKET_STATUSES.includes(status)) {
        return res.status(400).json({ message: 'Invalid ticket status' });
      }
      ticket.status = status;
      ticket.statusHistory.push({
        status,
        note: adminNotes ? String(adminNotes).slice(0, 300) : HISTORY_NOTES[status] || 'Status updated',
        technicianName: technicianName || ticket.technicianName,
        changedBy: req.admin?.username || 'admin',
        at: new Date()
      });
    }

    if (technicianName !== undefined) ticket.technicianName = String(technicianName).trim().slice(0, 80);
    if (adminNotes !== undefined) ticket.adminNotes = String(adminNotes).slice(0, 1000);

    const updatedService = await ticket.save();
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await ServiceTicket.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service ticket not found' });
    res.json({ message: 'Service ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
