const mongoose = require("mongoose");
const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.getUserProfile = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  const user_Id = req.user._id; // Authenticated user ID

  // Validate User ID
  console.log("Fetching profile for user ID:", user_Id);
  if (!mongoose.Types.ObjectId.isValid(user_Id)) {
    throw new ApiError(400, "Invalid User ID");
  }

  const user = await User.findById(user_Id).select("-password -otp");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: user,
  });
});

exports.updateUserProfile = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  const user_Id = req.user._id; // Authenticated user ID
  const { name, email } = req.body;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(user_Id)) {
    throw new ApiError(400, "Invalid User ID");
  }

  // Find User
  const user = await User.findById(user_Id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update Name
  if (name !== undefined) {
    user.name = name;
  }

  // Update Email
  if (email !== undefined) {
    // Check if another user already has this email
    const existingUser = await User.findOne({
      email,
      _id: { $ne: user_Id },
    });

    if (existingUser) {
      throw new ApiError(400, "Email already in use");
    }

    user.email = email;
  }

  await user.save();

  // Password response me nahi bhejna
  console.log("User after update:", user);
  const userData = user.toObject();
  delete userData.password;
  delete userData.otp;

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: userData,
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  const user_Id = req.user._id; // Authenticated user ID

  const { currentPassword, newPassword } = req.body;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(user_Id)) {
    throw new ApiError(400, "Invalid User ID");
  }

  // Validate fields
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  // New password current password se different hona chahiye
  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from the current password",
    );
  }

  // Password length
  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters");
  }

  // Find user
  const user = await User.findById(user_Id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check current password
  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Current password is incorrect");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Save new password
  user.password = hashedPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

exports.deactivateAccount = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  const user_Id = req.user._id; // Authenticated user ID

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(user_Id)) {
    throw new ApiError(400, "Invalid User ID");
  }

  // Find User
  const user = await User.findById(user_Id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Already inactive
  if (!user.isActive) {
    throw new ApiError(400, "Account is already deactivated");
  }

  // Deactivate account
  user.isActive = false;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Account deactivated successfully",
  });
});

// Get all users - Admin only
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// Deactivate user - Admin only
exports.deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isActive = false;
  user.deactivatedAt = new Date();

  await user.save();

  res.status(200).json({
    success: true,
    message: "User deactivated successfully",
  });
});

// Activate user - Admin only
exports.activateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.isActive = true;
  user.deactivatedAt = null;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User activated successfully",
  });
});
