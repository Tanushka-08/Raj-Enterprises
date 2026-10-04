const Enquiry = require('../models/Enquiry');
const { generateEnquiryId } = require('../utils/generateTicketId');

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().populate('productId', 'name').sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEnquiry = async (req, res) => {
  try {
    const enquiryId = generateEnquiryId();
    const newEnquiry = new Enquiry({
      ...req.body,
      enquiryId
    });
    const savedEnquiry = await newEnquiry.save();
    res.status(201).json(savedEnquiry);
  } catch (error) {
    // Only schema/cast problems are the caller's fault; anything else (e.g. DB down) is a server error
    const status = error.name === 'ValidationError' || error.name === 'CastError' ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedEnquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json(updatedEnquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
