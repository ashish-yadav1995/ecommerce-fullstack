const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const { authorize } = require("../middlewares/roleMiddleware");

const {
  getSellerDashboardStats,
  getSellerSales,
  getSellerRecentOrders,
  getMyProducts,
  getMyProductById,
} = require("../controllers/sellerController");

// =====================================================
// SELLER DASHBOARD
// =====================================================

router.get("/dashboard", protect, authorize("seller"), getSellerDashboardStats);

// =====================================================
// SELLER SALES
// =====================================================

router.get("/sales", protect, authorize("seller"), getSellerSales);

// =====================================================
// SELLER RECENT ORDERS
// =====================================================

router.get("/recent-orders", protect,  authorize("seller"),  getSellerRecentOrders);

// =====================================================
// SELLER MY PRODUCTS
// =====================================================

router.get("/products", protect, authorize("seller"), getMyProducts);

// =====================================================
// SELLER PRODUCT DETAILS
// =====================================================

router.get("/products/:id", protect, authorize("seller"), getMyProductById);

module.exports = router;
     