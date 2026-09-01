const express = require("express");

const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deactivateAccount,
} = require("../controllers/userController");

router.get("/:id", getUserProfile);

router.put("/:id", updateUserProfile);

router.put("/:id/change-password", changePassword);

// router.patch("/:id/deactivate", deactivateAccount);

module.exports = router;
