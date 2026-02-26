const express = require("express");
const router = express.Router();
const {
  createBarter,
  updateBarterStatus,
  scheduleSession,
  getBarters,
} = require("../controllers/barterController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBarter);
router.get("/", protect, getBarters);
router.put("/:id/status", protect, updateBarterStatus);
router.post("/:id/schedule", protect, scheduleSession);

module.exports = router;