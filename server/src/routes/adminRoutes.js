const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/authMiddleware");
const { getDashboardStats } = require("../controllers/adminController");

router.get("/dashboard", protect, authorize("admin"), getDashboardStats);

router.get("/admin/users", protect, authorize("admin"), getAllUsers);

router.patch(
  "/admin/users/:id/deactivate",
  protect,
  authorize("admin"),
  deactivateUser,
);

router.patch(
  "/admin/users/:id/activate",
  protect,
  authorize("admin"),
  activateUser,
);

module.exports = router;
