const Review = require("../models/Review");
const trustScore = require("../utils/trustScore");

// Create review
exports.createReview = async (req, res) => {
  try {
    const { revieweeId, barterId, rating, comment } = req.body;

    const review = await Review.create({
      reviewerId: req.user.id,
      revieweeId,
      barterId,
      rating,
      comment,
    });

    await trustScore(revieweeId);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews of a user
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.userId })
      .populate("reviewerId", "name");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};