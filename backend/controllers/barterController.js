const BarterRequest = require("../models/BarterRequest");
const creditCalculator = require("../utils/creditCalculator");

// Create barter request
exports.createBarter = async (req, res) => {
  try {
    const { receiverId, offeredSkill, neededSkill } = req.body;

    const barter = await BarterRequest.create({
      senderId: req.user.id,
      receiverId,
      offeredSkill,
      neededSkill,
      status: "Pending",
    });

    res.status(201).json(barter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update status (Accept / Reject / Ongoing / Completed)
exports.updateBarterStatus = async (req, res) => {
  try {
    const barter = await BarterRequest.findById(req.params.id);

    if (!barter)
      return res.status(404).json({ message: "Barter not found" });

    const userId = req.user.id;

    // Only sender or receiver can access
    if (
      barter.senderId.toString() !== userId &&
      barter.receiverId.toString() !== userId
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const newStatus = req.body.status;

    // Only receiver can Accept or Reject
    if (
      (newStatus === "Accepted" || newStatus === "Rejected") &&
      barter.receiverId.toString() !== userId
    ) {
      return res.status(403).json({
        message: "Only receiver can accept or reject the barter",
      });
    }

    // Only participants can mark Completed
    if (newStatus === "Completed") {
      if (
        barter.senderId.toString() !== userId &&
        barter.receiverId.toString() !== userId
      ) {
        return res.status(403).json({
          message: "Not allowed to complete this barter",
        });
      }

      
      const creditCalculator = require("../utils/creditCalculator");
      await creditCalculator(
        barter.senderId,
        barter.receiverId,
        2
      );
    }

    barter.status = newStatus;
    await barter.save();

    res.json(barter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getBarters = async (req, res) => {
  try {
    const barters = await BarterRequest.find({
      $or: [
        { senderId: req.user.id },
        { receiverId: req.user.id },
      ],
    })
      .populate("offeredSkill")
      .populate("neededSkill")
      .populate("senderId", "name credits trustScore")
      .populate("receiverId", "name credits trustScore");

    res.json(barters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Schedule session
exports.scheduleSession = async (req, res) => {
  try {
    const { date, time, mode } = req.body;

    const barter = await BarterRequest.findById(req.params.id);
    if (!barter) return res.status(404).json({ message: "Barter not found" });

    barter.sessions.push({ date, time, mode });
    await barter.save();

    res.json(barter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};