const Review = require("../models/Review");
const User = require("../models/User");

const trustScore = async (userId) => {
  try {
    const reviews = await Review.find({ revieweeId: userId });

    if (reviews.length === 0) return;

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = total / reviews.length;

    await User.findByIdAndUpdate(userId, {
      trustScore: average.toFixed(1),
    });
  } catch (error) {
    console.error("Trust score error:", error.message);
  }
};

module.exports = trustScore;