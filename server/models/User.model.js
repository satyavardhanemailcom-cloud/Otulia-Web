const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },

    subscription: {
      type: String,
      enum: ["freemium", "premium", "business_plan"],
      default: "freemium",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
