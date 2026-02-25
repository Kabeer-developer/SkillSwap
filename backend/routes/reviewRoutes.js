const express = require("express");
const router = express.Router();
const {
  createReview,
  getUserReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createReview);
router.get("/:userId", getUserReviews);

module.exports = router;