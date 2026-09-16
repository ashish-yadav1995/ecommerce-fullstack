const express = require("express");
const router = express.Router();
const { authLimiter } = require("../middlewares/rateLimiter");

const { register, login, verifyOTP, resendOTP } = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
  validate,
} = require("../validations/auth-validation");

// 3. Middlewares pipeline me authLimiter ko add kar diya
router.post("/register", authLimiter, registerValidation, validate, register);

router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/resend-otp", authLimiter, resendOTP);

router.post("/login", authLimiter, loginValidation, validate, login);

module.exports = router;
