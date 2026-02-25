const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  date: String,
  time: String,
  mode: {
    type: String,
    enum: ["Online", "In-Person"],
  },
});

const barterSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    offeredSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    neededSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Ongoing", "Completed", "Rejected"],
      default: "Pending",
    },
    sessions: [sessionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("BarterRequest", barterSchema);