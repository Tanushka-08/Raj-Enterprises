const ServiceTicket = require('../models/ServiceTicket');
const Customer = require('../models/Customer');
const { generateTicketId } = require('../utils/generateTicketId');

exports.getAllServices = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const services = await ServiceTicket.find(query).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceByTicketId = async (req, res) => {
  try {
    const service = await ServiceTicket.findOne({ ticketId: req.params.ticketId });
    if (!service) return res.status(404).json({ message: 'Service ticket not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackService = async (req, res) => {
  try {
    const { ticketId, mobile } = req.body;
    const service = await ServiceTicket.findOne({ ticketId, mobile });
    if (!service) return res.status(404).json({ message: 'Ticket not found or mobile number mismatch' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const ticketId = generateTicketId();
    const newService = new ServiceTicket({
      ...req.body,
      ticketId
    });
    
    const savedService = await newService.save();

    // Create or update customer
    const existingCustomer = await Customer.findOne({ mobile: req.body.mobile });
    if (!existingCustomer) {
      await Customer.create({
        name: req.body.customerName,
        mobile: req.body.mobile,
        email: req.body.email,
        flat: req.body.flat,
        address: req.body.address,
        pincode: req.body.pincode,
        customerType: req.body.customerType
      });
    }

    res.status(201).json(savedService);
  } catch (error) {
    // Only schema/cast problems are the caller's fault; anything else (e.g. DB down) is a server error
    const status = error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const updatedService = await ServiceTicket.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        technicianName: req.body.technicianName,
        adminNotes: req.body.adminNotes
      },
      { new: true, runValidators: true }
    );
    if (!updatedService) return res.status(404).json({ message: 'Service ticket not found' });
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
