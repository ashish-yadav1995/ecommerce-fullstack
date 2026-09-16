const User = require("../models/User");

const { hashPassword, comparePassword } = require("../utils/authUtils");

const { sendOTP } = require("../services/emailService");

const { generateToken } = require("../utils/jwtUtils");

const asyncHandler = require("../middlewares/asyncHandler");

const ApiError = require("../utils/ApiError");

// =========================
// REGISTER
// =========================

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

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

  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  // 4. Hash Password
  const hashedPassword = await hashPassword(password);

  // 5. Generate OTP
  const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

  // OTP valid for 10 minutes
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // 6. Create User
  await User.create({
    name,
    email,
    password: hashedPassword,
    otp: {
      code: generatedOTP,
      expiresAt: otpExpiry,
    },
  });

  // 7. Send OTP
  await sendOTP(email, generatedOTP);

  // 8. Response
  res.status(201).json({
    success: true,
    message: "Registration successful! Please check your email for OTP.",
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
  const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

  // 6. New OTP expiry - 10 minutes
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // 7. Replace old OTP
  user.otp = {
    code: generatedOTP,
    expiresAt: otpExpiry,
    lastSentAt: new Date(),
  };

  await user.save();

  // 8. Send NEW OTP
  await sendOTP(user.email, generatedOTP);

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
  const { email, password } = req.body;

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
    throw new ApiError(403, "Your account has been deactivated");
  }

  // 4. Check password
  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 5. Check email verification
  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  // 6. Generate JWT
  const token = generateToken(user._id);

  // 7. Response
  res.status(200).json({
    success: true,
    message: "Login successful",
    token,

    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});
