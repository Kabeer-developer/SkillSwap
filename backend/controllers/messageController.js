const Message = require("../models/Message");

// Get messages of a barter
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ barterId: req.params.barterId })
      .populate("senderId", "name");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { barterId, text } = req.body;

    const message = await Message.create({
      barterId,
      senderId: req.user.id,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};