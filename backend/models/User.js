const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  title: String,
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Expert"],
  },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: String,
    bio: String,
    avatar: String,

    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },

    credits: {
      type: Number,
      default: 10,
    },

    trustScore: {
      type: Number,
      default: 0,
    },

    skillsOffered: [skillSchema],
    skillsNeeded: [skillSchema],

    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);