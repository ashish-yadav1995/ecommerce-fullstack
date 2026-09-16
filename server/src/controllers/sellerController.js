const Product = require("../models/Product");
const Order = require("../models/Order");

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

// =====================================================
// SELLER DASHBOARD STATS
// =====================================================

exports.getSellerDashboardStats = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  // Products
  const totalProducts = await Product.countDocuments({
    seller: sellerId,
  });

  const activeProducts = await Product.countDocuments({
    seller: sellerId,
    isActive: true,
  });

  const inactiveProducts = await Product.countDocuments({
    seller: sellerId,
    isActive: false,
  });

  // Orders
  const orders = await Order.find({
    "orderItems.seller": sellerId,
  });

  let pendingOrders = 0;
  let confirmedOrders = 0;
  let processingOrders = 0;
  let shippedOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;

  let totalSales = 0;

  orders.forEach((order) => {
    const sellerItems = order.orderItems.filter(
      (item) => item.seller.toString() === sellerId.toString(),
    );

    sellerItems.forEach((item) => {
      totalSales += item.totalPrice;
    });

    switch (order.orderStatus) {
      case "Pending":
        pendingOrders++;
        break;

      case "Confirmed":
        confirmedOrders++;
        break;

      case "Processing":
        processingOrders++;
        break;

      case "Shipped":
        shippedOrders++;
        break;

      case "Delivered":
        deliveredOrders++;
        break;

      case "Cancelled":
        cancelledOrders++;
        break;
    }
  });

  res.status(200).json({
    success: true,

    data: {
      products: {
        total: totalProducts,
        active: activeProducts,
        inactive: inactiveProducts,
      },

      orders: {
        total: orders.length,
        pending: pendingOrders,
        confirmed: confirmedOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
        cancelled: cancelledOrders,
      },

      sales: {
        total: totalSales,
      },
    },
  });
});

// =====================================================
// SELLER SALES / REVENUE
// =====================================================

exports.getSellerSales = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const orders = await Order.find({
    "orderItems.seller": sellerId,
  })
    .populate("orderItems.product", "name images")
    .sort({ createdAt: -1 });

  let totalRevenue = 0;
  let deliveredRevenue = 0;
  let pendingRevenue = 0;

  const sales = [];

  orders.forEach((order) => {
    const sellerItems = order.orderItems.filter(
      (item) => item.seller.toString() === sellerId.toString(),
    );

    const sellerOrderTotal = sellerItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    totalRevenue += sellerOrderTotal;

    if (order.orderStatus === "Delivered") {
      deliveredRevenue += sellerOrderTotal;
    }

    if (
      order.orderStatus === "Pending" ||
      order.orderStatus === "Confirmed" ||
      order.orderStatus === "Processing"
    ) {
      pendingRevenue += sellerOrderTotal;
    }

    sales.push({
      orderId: order._id,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      amount: sellerOrderTotal,
      createdAt: order.createdAt,
      items: sellerItems,
    });
  });

  res.status(200).json({
    success: true,

    data: {
      summary: {
        totalRevenue,
        deliveredRevenue,
        pendingRevenue,
      },

      sales,
    },
  });
});

// =====================================================
// SELLER RECENT ORDERS
// =====================================================

exports.getSellerRecentOrders = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const orders = await Order.find({
    "orderItems.seller": sellerId,
  })
    .populate("user", "name email")
    .populate("orderItems.product", "name images")
    .sort({ createdAt: -1 })
    .limit(10);

  const recentOrders = orders.map((order) => {
    const sellerItems = order.orderItems.filter(
      (item) => item.seller.toString() === sellerId.toString(),
    );

    const itemsPrice = sellerItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    return {
      _id: order._id,

      customer: order.user,

      orderStatus: order.orderStatus,

      paymentMethod: order.paymentMethod,

      paymentStatus: order.paymentStatus,

      itemsPrice,

      orderItems: sellerItems,

      createdAt: order.createdAt,
    };
  });

  res.status(200).json({
    success: true,

    count: recentOrders.length,

    data: recentOrders,
  });
});

// =====================================================
// SELLER MY PRODUCTS
// =====================================================

exports.getMyProducts = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const products = await Product.find({
    seller: sellerId,
  })
    .populate("category", "name slug")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,

    count: products.length,

    data: products,
  });
});

// =====================================================
// SELLER PRODUCT DETAILS
// =====================================================

exports.getMyProductById = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const product = await Product.findOne({
    _id: req.params.id,
    seller: sellerId,
  }).populate("category", "name slug");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res.status(200).json({
    success: true,

    data: product,
  });
});
