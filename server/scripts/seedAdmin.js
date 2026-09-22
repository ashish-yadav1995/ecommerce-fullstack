require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../src/models/User");
const { hashPassword } = require("../src/utils/authUtils");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const adminEmail = "admin@test.com";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await hashPassword("Admin@123");

    const admin = await User.create({
      name: "Test Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      isActive: true,
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Role:", admin.role);

    process.exit(0);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();



// Important

// Admin ko OTP ki zarurat nahi rakhi hai because ye controlled backend creation hai.

// Admin automatically:

// isVerified = true
// role = admin
// isActive = true

// hoga.