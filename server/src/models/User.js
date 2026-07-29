const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },

    // OTP Fields
    otp: {
      code: String,
      expiresAt: Date,
    },
    isVerified: { type: Boolean, default: false }, // User verify hone ke baad true hoga
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
