// const express = require("express");
// const router = express.Router();
// const { authorize } = require("../middlewares/roleMiddleware");
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   getAllUsers,
//   getDashboardStats,
//   deactivateUser,
//   activateUser

// } = require("../controllers/adminController");

// router.get("/dashboard", protect, authorize("admin"), getDashboardStats);

// router.get("/admin/users", protect, authorize("admin"), getAllUsers);

// router.patch(
//   "/admin/users/:id/deactivate",
//   protect,
//   authorize("admin"),
//   deactivateUser,
// );

// router.patch(
//   "/admin/users/:id/activate",
//   protect,
//   authorize("admin"),
//   activateUser,
// );

// module.exports = router;

// ==========================================

const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const { authorize } = require("../middlewares/roleMiddleware");

const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  deactivateUser,
  activateUser,
  getAllProducts,
  deactivateProduct,
  activateProduct,
  getRecentOrders,
  getAllReviews,
} = require("../controllers/adminController");

// =====================================================
// DASHBOARD
// =====================================================

router.get("/dashboard", protect, authorize("admin"), getDashboardStats);

// =====================================================
// USERS
// =====================================================

router.get("/users", protect, authorize("admin"), getAllUsers);

router.get("/users/:id", protect, authorize("admin"), getUserById);

router.patch(
  "/users/:id/deactivate",
  protect,
  authorize("admin"),
  deactivateUser,
);

router.patch("/users/:id/activate", protect, authorize("admin"), activateUser);

// =====================================================
// PRODUCTS
// =====================================================

router.get("/products", protect, authorize("admin"), getAllProducts);

router.patch(
  "/products/:id/deactivate",
  protect,
  authorize("admin"),
  deactivateProduct,
);

router.patch(
  "/products/:id/activate",
  protect,
  authorize("admin"),
  activateProduct,
);

// =====================================================
// RECENT ORDERS
// =====================================================

router.get("/orders/recent", protect, authorize("admin"), getRecentOrders);

// =====================================================
// REVIEWS
// =====================================================

router.get("/reviews", protect, authorize("admin"), getAllReviews);

module.exports = router;
