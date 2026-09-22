const express = require("express");
const router = express.Router();
const { authLimiter } = require("../middlewares/rateLimiter");
const { protect } = require("../middlewares/authMiddleware")

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
  registerSeller,
  getMe,
  logout,
} = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
  validate,
} = require("../validations/auth-validation");

// 3. Middlewares pipeline me authLimiter ko add kar diya
router.post("/register", authLimiter, registerValidation, validate, register);
router.post(
  "/register-seller",
  authLimiter,
  registerValidation,
  validate,
  registerSeller,
);
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/resend-otp", authLimiter, resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);
router.post("/logout", logout);

router.post("/login", authLimiter, loginValidation, validate, login);

module.exports = router;
