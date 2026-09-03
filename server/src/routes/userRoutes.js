const express = require("express");

const router = express.Router();

const { protect } =  require("../middlewares/authMiddleware")

const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deactivateAccount,
} = require("../controllers/userController");

router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateUserProfile);

router.put("/profile/change-password", protect, changePassword);

router.patch("/profile/deactivate", protect, deactivateAccount);

module.exports = router;
