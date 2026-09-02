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

  // 2. Password Length Check (Pehle lagayein taaki faltu DB query na chalani pade)
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  // 3. Check Existing User
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  // 4. Hash Password (Agar model me pre-save hook nahi hai toh)
  const hashedPassword = await hashPassword(password);

  // 5. Generate 6-digit OTP & Expiry (10 mins)
  const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // 6. Create User in Database
  const user = await User.create({
    name,
    email,
    password: hashedPassword, // Ya direct password agar schema me hook hai
    otp: {
      code: generatedOTP,
      expiresAt: otpExpiry,
    },
  });

  // 7. Send OTP (AWAIT Lagana Mandatory Hai)
  await sendOTP(email, generatedOTP);

  // 8. Final Response
  res.status(201).json({
    success: true,
    message: "Registration successful! Please check your email for OTP.",
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
  // Password me select:false hai
  // isliye +password zaroori hai
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