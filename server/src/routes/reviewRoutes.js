const express = require("express");

const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

const {
    addReview,
    getProductReviews,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");

// router.post("/", addReview);

// router.get("/product/:productId", getProductReviews);

// router.put("/:id", updateReview);

// router.delete("/:id", deleteReview);

// =============================================================


// PUBLIC ROUTES (Bina login ke chalenge)
// ==========================================
// Taaki koi bhi guest customer product page par reviews padh sake
router.get("/product/:productId", getProductReviews);

// ==========================================
// PROTECTED ROUTES (Inke liye Login/JWT zaroori hai)
// ==========================================


// Iske niche ke saare routes automatic token maangenge

router.use(protect);   // ye line ka matlab hai ki iske niche ke saare routes ke liye authentication middleware apply hoga. Yani ki user ko login hona zaroori hai in routes ko access karne ke liye. aur iske upar ke routes public hai, yani ki unke liye login ki zaroorat nahi hai.koi bhi user inhe access kar sakta hai.

router.post("/", addReview);         // POST /api/v1/reviews (Naya review likhne ke liye)
router.put("/:id", updateReview);     // PUT /api/v1/reviews/:id (Apna review edit karne ke liye)
router.delete("/:id", deleteReview);  // DELETE /api/v1/reviews/:id (Apna review delete karne ke liye)

module.exports = router;