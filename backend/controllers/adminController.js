const User = require("../models/User");
const BarterRequest = require("../models/BarterRequest");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ban / Unban user
exports.toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({ message: "User status updated", isBanned: user.isBanned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View all barters
exports.getAllBarters = async (req, res) => {
  try {
    const barters = await BarterRequest.find()
      .populate("senderId receiverId", "name email");

    res.json(barters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};