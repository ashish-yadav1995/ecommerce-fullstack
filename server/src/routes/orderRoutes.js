const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getSellerOrders,
  updateSellerOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");


// Customer → Place Order
router.post("/", protect, authorize("customer"), placeOrder);

// Customer → My Orders
router.get("/my-orders", protect, getMyOrders);

// Seller → Own Orders
router.get("/seller/my-orders", protect, authorize("seller"), getSellerOrders);

// Seller → Update Own Order
router.patch(
  "/seller/:id/status",
  protect,
  authorize("seller"),
  updateSellerOrderStatus,
);

// Admin → All Orders
router.get("/admin/all", protect, authorize("admin"), getAllOrders);

// Admin → Update Any Order
router.patch(
  "/admin/:id/status",
  protect,
  authorize("admin"),
  updateOrderStatus,
);

// Single Order  koi bhi access kar sakta hai, bas uska order hona chahiye ya admin hona chahiye
router.get("/:id", protect, getOrderById);

module.exports = router;
