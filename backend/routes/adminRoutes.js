const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  toggleBanUser,
  getAllBarters,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.get("/users", protect, isAdmin, getAllUsers);
router.put("/ban/:id", protect, isAdmin, toggleBanUser);
router.get("/barters", protect, isAdmin, getAllBarters);

module.exports = router;