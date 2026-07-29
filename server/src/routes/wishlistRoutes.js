const express = require("express");

const router = express.Router();

const {
    addToWishlist,
    getWishlist,
    removeWishlistItem,
    clearWishlist,
} = require("../controllers/wishlistController");

router.post("/", addToWishlist);

router.get("/:userId", getWishlist);

router.delete("/:id", removeWishlistItem);

router.delete("/", clearWishlist);

module.exports = router;