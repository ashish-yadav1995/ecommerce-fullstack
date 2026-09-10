const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");

const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/product/:productId", getProductReviews);
router.post("/", protect, authorize("customer"), addReview); // POST /api/v1/reviews (Naya review likhne ke liye)
router.put("/:id", protect, authorize("customer"), updateReview); // PUT /api/v1/reviews/:id (Apna review edit karne ke liye)
router.delete("/:id", protect, authorize("customer", "admin"), deleteReview); // DELETE /api/v1/reviews/:id (Apna review delete karne ke liye)

module.exports = router;
