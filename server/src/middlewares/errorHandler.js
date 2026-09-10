// const errorHandler = (err, req, res, next) => {

//     const statusCode = err.statusCode || 500;

//     res.status(statusCode).json({
//         success: false,
//         message: err.message || "Internal Server Error",
//     });

// };

// module.exports = errorHandler;

// =========================================================


const errorHandler = (err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || 500;

    let message =
        err.message || "Internal Server Error";

    // MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate value already exists";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((error) => error.message)
            .join(", ");
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID";
    }

    // JWT errors
    if (
        err.name === "JsonWebTokenError" ||
        err.name === "TokenExpiredError"
    ) {
        statusCode = 401;
        message = "Invalid or expired token";
    }

    const response = {
        success: false,
        message,
    };

    // Development me debugging information
    if (process.env.NODE_ENV === "development") {
        response.error = err.message;
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;