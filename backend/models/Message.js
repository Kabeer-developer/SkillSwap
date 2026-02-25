const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    barterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BarterRequest",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);