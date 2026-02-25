const User = require("../models/User");

const creditCalculator = async (senderId, receiverId, creditDifference) => {
  try {
    if (creditDifference > 0) {
      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      if (!sender || !receiver) return;

      sender.credits -= creditDifference;
      receiver.credits += creditDifference;

      await sender.save();
      await receiver.save();
    }
  } catch (error) {
    console.error("Credit calculation error:", error.message);
  }
};

module.exports = creditCalculator;