const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");

// router.post("/", placeOrder);

// router.get("/details/:id", getOrderById);

// router.get("/:userId", getMyOrders);

// router.patch("/:id/cancel", cancelOrder);

// router.patch("/:id/status", updateOrderStatus);

// router.get("/admin/all", getAllOrders);

router.post("/", protect, placeOrder);

router.get("/details/:id", protect, getOrderById);

router.get("/", protect, getMyOrders); // no need to pass userId in the request body or params because req.user_Id is available in the request object after authentication middleware.

router.patch("/:id/cancel", protect, cancelOrder);

router.patch("/:id/status", protect, updateOrderStatus);

router.get("/admin/all", protect, getAllOrders);

module.exports = router;
