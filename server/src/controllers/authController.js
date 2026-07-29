const User = require('../models/User');
const { hashPassword } = require('../utils/authUtils');
const { sendOTP } = require('../services/emailService');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check existing user
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // 2. Generate 6-digit OTP
        const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

        // 3. Hash Password
        const hashedPassword = await hashPassword(password);

        // 4. Create User with OTP
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp: { code: generatedOTP, expiresAt: otpExpiry }
        });

        // 5. Send OTP via Email
        await sendOTP(email, generatedOTP);

        res.status(201).json({
            success: true,
            message: "Registration successful! Please check your email for OTP."
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};