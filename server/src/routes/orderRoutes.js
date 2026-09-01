const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", placeOrder);

router.get("/details/:id", getOrderById);

router.get("/:userId", getMyOrders);

router.patch("/:id/cancel", cancelOrder);

router.patch("/:id/status", updateOrderStatus);

// router.get("/admin/all", getAllOrders);

module.exports = router;
