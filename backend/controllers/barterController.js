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

    if (!barter) return res.status(404).json({ message: "Barter not found" });

    barter.status = req.body.status;
    await barter.save();

    res.json(barter);
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