const express = require("express");
const router = express.Router();
const {
  createSkill,
  getSkills,
  getSkillById,
} = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSkill);
router.get("/", getSkills);
router.get("/:id", getSkillById);

module.exports = router;