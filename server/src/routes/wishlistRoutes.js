const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
  clearWishlist,
} = require("../controllers/wishlistController");

// router.post("/", addToWishlist);

// router.get("/:userId", getWishlist);

// router.delete("/:id", removeWishlistItem);

// router.delete("/", clearWishlist);

// req.user_Id is available in the request object after authentication middleware that why we don't need to pass user_Id in the request body or params.

router.post("/", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.delete("/:productId", protect, removeWishlistItem);
router.delete("/", protect, clearWishlist);

module.exports = router;
