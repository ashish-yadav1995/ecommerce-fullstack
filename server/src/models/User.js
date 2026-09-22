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
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },

    deactivatedAt: {
      type: Date,
      default: null,
    },

    // OTP
    // otp: {
    //   code: String,
    //   expiresAt: Date,
    // },

    otp: {
      code: {
        type: String,
      },

      expiresAt: {
        type: Date,
      },

      lastSentAt: {
        type: Date,
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    passwordResetOtp: {
      type: String,
      default: null,
    },

    passwordResetExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
