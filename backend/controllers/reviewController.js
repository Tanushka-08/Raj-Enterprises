const Review = require('../models/Review');

exports.getAllReviews = async (req, res) => {
  try {
    // If admin is logged in (req.admin exists), show all. Otherwise, only approved.
    const query = req.admin ? {} : { isApproved: true };
    const reviews = await Review.find(query).populate('productId', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Public submission: always stored as unapproved for admin moderation
exports.createPublicReview = async (req, res) => {
  try {
    const { customerName, rating, review } = req.body;
    if (!customerName || !rating || !review) {
      return res.status(400).json({ message: 'Name, rating and review text are required' });
    }
    const newReview = new Review({
      customerName,
      rating,
      review,
      isApproved: false
    });
    const savedReview = await newReview.save();
    res.status(201).json({ message: 'Review submitted for approval', review: savedReview });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReview) return res.status(404).json({ message: 'Review not found' });
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
