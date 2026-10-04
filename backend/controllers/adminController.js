const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const ServiceTicket = require('../models/ServiceTicket');
const Customer = require('../models/Customer');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const payload = {
      id: admin._id,
      username: admin.username,
      role: admin.role
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret_if_not_set', { expiresIn: '24h' });
    
    res.json({ token, admin: payload });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) return res.status(400).json({ message: 'Username already exists' });
    
    const newAdmin = new Admin({ username, password, email });
    await newAdmin.save();
    
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalEnquiries = await Enquiry.countDocuments();
    const totalServiceRequests = await ServiceTicket.countDocuments();
    const pendingRequests = await ServiceTicket.countDocuments({ status: 'Request Logged' });
    const activeRequests = await ServiceTicket.countDocuments({ status: { $in: ['Technician Assigned', 'In Progress'] } });
    const completedRequests = await ServiceTicket.countDocuments({ status: 'Completed' });
    const totalCustomers = await Customer.countDocuments();
    
    res.json({
      totalProducts,
      totalEnquiries,
      totalServiceRequests,
      pendingRequests,
      activeRequests,
      completedRequests,
      totalCustomers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
