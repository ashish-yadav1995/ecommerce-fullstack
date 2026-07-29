const express = require("express");
const router = express.Router();

const { register } = require("../controllers/authController");

const {
  registerValidation,
  validate,
} = require("../validations/auth-validation");

router.post(
  "/register",
  registerValidation,
  validate,
  register
);

module.exports = router;