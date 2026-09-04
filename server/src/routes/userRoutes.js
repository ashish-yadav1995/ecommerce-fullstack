// const express = require("express");

// const router = express.Router();

// const { protect } =  require("../middlewares/authMiddleware")

// const {
//   getUserProfile,
//   updateUserProfile,
//   changePassword,
//   deactivateAccount,
// } = require("../controllers/userController");

// router.get("/profile", protect, getUserProfile);

// router.put("/profile", protect, updateUserProfile);

// router.put("/profile/change-password", protect, changePassword);

// router.patch("/profile/deactivate", protect, deactivateAccount);

// module.exports = router;

const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deactivateAccount,
  getAllUsers,
  deactivateUser,
  activateUser,
} = require("../controllers/userController");

router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateUserProfile);

router.put("/profile/change-password", protect, changePassword);

router.patch("/profile/deactivate", protect, deactivateAccount);

// ================= ADMIN =================

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
