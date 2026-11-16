const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Category = require("../models/Category");

// =====================================================
// ADMIN DASHBOARD STATS
// =====================================================

exports.getDashboardStats = asyncHandler(async (req, res) => {
  // =========================
  // USERS
  // =========================
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const inactiveUsers = await User.countDocuments({ isActive: false });
  const customers = await User.countDocuments({ role: "customer" });
  const sellers = await User.countDocuments({ role: "seller" });
  const admins = await User.countDocuments({ role: "admin" });

  // =========================
  // PRODUCTS
  // =========================
  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ isActive: true });
  const inactiveProducts = await Product.countDocuments({ isActive: false });

  // =========================
  // CATEGORIES
  // =========================
  const totalCategories = await Category.countDocuments();

  // =========================
  // ORDERS & REVENUE
  // =========================
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: "Pending" });
  const processingOrders = await Order.countDocuments({ orderStatus: "Processing" });
  const shippedOrders = await Order.countDocuments({ orderStatus: "Shipped" });
  const deliveredOrders = await Order.countDocuments({ orderStatus: "Delivered" });
  const cancelledOrders = await Order.countDocuments({ orderStatus: "Cancelled" });

  // Revenue calculation (Delivered orders ka total amount)
  const revenueResult = await Order.aggregate([
    { $match: { orderStatus: "Delivered" } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // =========================
  // REVIEWS
  // =========================
  const totalReviews = await Review.countDocuments();

  // =========================
  // RESPONSE
  // =========================
  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        customers,
        sellers,
        admins,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
      },
      categories: {
        total: totalCategories,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },
      reviews: {
        total: totalReviews,
      },
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
  //  Fix: req.user._id ki jagah req.params.id use karein
  const user = await User.findById(req.params.id);

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
// =====================================================
// GET USER BY ID
// =====================================================

exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// =====================================================
// GET ALL PRODUCTS - ADMIN
// =====================================================

exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("seller", "name email")
    .populate("category", "name slug")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

// // =====================================================
// // GET ALL PRODUCTS - ADMIN
// // =====================================================

// exports.getAllProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find()
//     .populate("seller", "name email")
//     .populate("category", "name slug")
//     .sort({
//       createdAt: -1,
//     });

//   res.status(200).json({
//     success: true,
//     count: products.length,
//     data: products,
//   });
// });

// =====================================================
// DEACTIVATE PRODUCT
// =====================================================

exports.deactivateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.isActive = false;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product deactivated successfully",
  });
});

// =====================================================
// ACTIVATE PRODUCT
// =====================================================

exports.activateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  product.isActive = true;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product activated successfully",
  });
});

// =====================================================
// GET ALL REVIEWS - ADMIN
// =====================================================

exports.getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name email")
    .populate("product", "name")
    .sort({
      createdAt: -1,
    });

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found",
    });
  }

  await review.deleteOne();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});


// =====================================================
// RECENT ORDERS
// =====================================================

exports.getRecentOrders = asyncHandler(
  async (req, res) => {

    const orders = await Order.find()
      .populate(
        "user",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .limit(10);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  }
);

// adminController.js
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product"); // ya jo bhi product reference ho

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json({
    success: true,
    order,
  });
});