const express = require("express");
const router = express.Router();
const {
  createBarter,
  updateBarterStatus,
  scheduleSession,
} = require("../controllers/barterController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBarter);
router.put("/:id/status", protect, updateBarterStatus);
router.post("/:id/schedule", protect, scheduleSession);

module.exports = router;