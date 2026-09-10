const User = require("../models/userModel");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const deactivatedUsers = await User.countDocuments({ isActive: false });
  const customers = await User.contDocuments({ role: "customer" });
  const sellers = await User.countDocuments({ role: "seller" });
  const admins = await User.countDocuments({ role: "admin" });

  res.status(200).json({
    success: true,
    message: "Dashboard stats fetched successfully",
    data: {
      total: totalUsers,
      active: activeUsers,
      deactivated: deactivatedUsers,
      customers,
      sellers,
      admins,
    },
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

