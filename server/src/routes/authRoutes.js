const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit"); // 1. Rate limit package ko import kiya

// 2. Strict Auth Limiter configured kiya (15 mins me max 5 attempts)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
        success: false,
        message: "Too many login/register attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const { register, login } = require("../controllers/authController");

const {
  registerValidation,
  loginValidation,
  validate,
} = require("../validations/auth-validation");

// 3. Middlewares pipeline me authLimiter ko add kar diya
router.post("/register", authLimiter, registerValidation, validate, register);

router.post("/login", authLimiter, loginValidation, validate, login);

module.exports = router;
