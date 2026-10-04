const AMCPlan = require('../models/AMCPlan');

exports.getAllAMCPlans = async (req, res) => {
  try {
    const plans = await AMCPlan.find({ isActive: true }).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAMCPlanById = async (req, res) => {
  try {
    const plan = await AMCPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'AMC Plan not found' });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAMCPlan = async (req, res) => {
  try {
    const newPlan = new AMCPlan(req.body);
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAMCPlan = async (req, res) => {
  try {
    const updatedPlan = await AMCPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPlan) return res.status(404).json({ message: 'AMC Plan not found' });
    res.json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteAMCPlan = async (req, res) => {
  try {
    const plan = await AMCPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'AMC Plan not found' });
    res.json({ message: 'AMC Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
