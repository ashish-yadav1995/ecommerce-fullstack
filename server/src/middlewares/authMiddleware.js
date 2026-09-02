const jwt = require("jsonwebtoken");

const User = require("../models/User");

const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/ApiError");


// ===============================
// PROTECT MIDDLEWARE
// ===============================

const protect = asyncHandler(async (req, res, next) => {

    let token;

    // 1. Check Authorization Header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    // 2. Token nahi mila
    if (!token) {
        throw new ApiError(
            401,
            "Authentication required. Please login."
        );
    }

    // 3. Verify JWT
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    // 4. Token se user find karo
    const user = await User.findById(decoded.id);

    if (!user) {
        throw new ApiError(
            401,
            "User not found"
        );
    }

    // 5. Account active hai ya nahi
    if (!user.isActive) {
        throw new ApiError(
            403,
            "Your account has been deactivated"
        );
    }

    // 6. User ko request ke andar attach karo
    req.user = user;

    // 7. Next middleware/controller
    next();
});


module.exports = {
    protect,
};