const express = require("express");

const router = express.Router();

const {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");

router.post("/", addReview);

router.get("/product/:productId", getProductReviews);

router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

module.exports = router;
