const User = require("../models/User");

const { hashPassword, comparePassword } = require("../utils/authUtils");

const { sendOTP } = require("../services/emailService");

const { generateToken } = require("../utils/jwtUtils");

const crypto = require("crypto");

const asyncHandler = require("../middlewares/asyncHandler");

const ApiError = require("../utils/ApiError");

// =========================
// CUSTOMER REGISTER
// =========================

exports.register = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  // 1. Inputs Check
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // 2. Password Length Check
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  // 3. Check Existing User
  const userExists = await User.findOne({ email });

  if (userExists && !userExists.isVerified) {
    return res.status(403).json({
      success: false,
      message:
        "Your account is already registered but email is not verified. Please verify your OTP.",
      code: "EMAIL_NOT_VERIFIED",
      email: userExists.email,
    });
  }

  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  // 4. Hash Password
  const hashedPassword = await hashPassword(password);

  // 5. Generate OTP
  generatedOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
  };

  const currentOTP = generatedOTP();

  // OTP valid for 10 minutes
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // 6. Create User
  await User.create({
    name,
    email,
    password: hashedPassword,
    otp: {
      code: currentOTP,
      expiresAt: otpExpiry,
    },
  });

  // 7. Send OTP
  await sendOTP(email, currentOTP);

  // 8. Response
  res.status(201).json({
    success: true,
    message: "Registration successful! Please check your email for OTP.",
  });
});

// ==========================
// SELLER REGISTERATION
// ==========================

// REGISTER SELLER
exports.registerSeller = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  const { password } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const generatedOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
  };

  const currentOTP = generatedOTP();

  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const seller = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "seller",
    otp: {
      code: currentOTP,
      expiresAt: otpExpiry,
    },
  });

  await sendOTP(email, currentOTP);

  res.status(201).json({
    success: true,
    message: "Seller registration successful! Please check your email for OTP.",
  });
});

// =========================
// VERIFY OTP
// =========================

exports.verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // 1. Validate input
  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  // 2. Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3. Already verified?
  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  // 4. Check OTP exists
  if (!user.otp || !user.otp.code) {
    throw new ApiError(400, "OTP not found. Please request a new OTP");
  }

  // 5. Check OTP expiry
  if (!user.otp.expiresAt || user.otp.expiresAt < new Date()) {
    throw new ApiError(400, "OTP has expired. Please request a new OTP");
  }

  // 6. Compare OTP
  if (user.otp.code !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // 7. Verify user
  user.isVerified = true;

  // 8. Remove OTP after successful verification
  user.otp = {
    code: undefined,
    expiresAt: undefined,
  };

  await user.save();

  // 9. Response
  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

// =========================
// RESEND OTP
// =========================

exports.resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. Email required
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // 2. Find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 3. Already verified
  if (user.isVerified) {
    throw new ApiError(400, "Email is already verified");
  }

  // 4. Resend cooldown - 60 seconds
  if (user.otp?.lastSentAt) {
    const secondsPassed = (Date.now() - user.otp.lastSentAt.getTime()) / 1000;

    if (secondsPassed < 60) {
      const secondsRemaining = Math.ceil(60 - secondsPassed);

      throw new ApiError(
        429,
        `Please wait ${secondsRemaining} seconds before requesting a new OTP`,
      );
    }
  }

  // 5. Generate NEW OTP
  const generatedOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
  };

  const currentOTP = generatedOTP();

  // 6. New OTP expiry - 10 minutes
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // 7. Replace old OTP
  user.otp = {
    code: currentOTP,
    expiresAt: otpExpiry,
    lastSentAt: new Date(),
  };

  await user.save();

  // 8. Send NEW OTP
  await sendOTP(user.email, currentOTP);

  // 9. Response
  res.status(200).json({
    success: true,
    message: "OTP resent successfully",
  });
});

// =========================
// LOGIN
// =========================

exports.login = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  // 1. Validate fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  // 2. Find user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Check account active
  if (!user.isActive) {
    // throw new ApiError(403, "Your account has been deactivated");
    return res.status(403).json({
      success: false,
      message: "Your account has been deactivated. Please contact support.",
      code: "ACCOUNT_DEACTIVATED",
    });
  }

  // 4. Check password
  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 5. Check email verification
  if (!user.isVerified) {
    // throw new ApiError(403, "Please verify your email first");
    return res.status(403).json({
      success: false,
      message: "Please verify your email first",
      code: "EMAIL_NOT_VERIFIED",
      email: user.email,
    });
  }

  // 6. Generate JWT
  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // 7. Response
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});

// GET CURRENT LOGGED-IN USER
exports.getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      isVerified: req.user.isVerified,
    },
  });
});

// LOGOUT
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "No account found with this email");
  }
// 5. Generate NEW OTP
  const generatedOTP = () => {
    return crypto.randomInt(100000, 1000000).toString();
  };

  const otp = generatedOTP();

  user.passwordResetOtp = otp;
  user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  await sendOTP(email, otp);

  res.status(200).json({
    success: true,
    message: "Password reset OTP sent successfully",
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP and new password are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (
    !user.passwordResetOtp ||
    user.passwordResetOtp !== otp ||
    !user.passwordResetExpiresAt ||
    user.passwordResetExpiresAt < new Date()
  ) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  user.password = await hashPassword(newPassword);

  user.passwordResetOtp = null;
  user.passwordResetExpiresAt = null;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully. Please login.",
  });
});
