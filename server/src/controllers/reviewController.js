const mongoose = require("mongoose");

const Review = require("../models/Review");
const Product = require("../models/Product");

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.addReview = asyncHandler(async (req, res) => {
    const user = req.user._id; // Authenticated user ID
    const { product, rating, comment } = req.body;

    // Validate User ID
    if (!mongoose.Types.ObjectId.isValid(user)) {
        throw new ApiError(400, "Invalid User ID");
    }

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(product)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    // Validate Required Fields
    if (!rating || !comment) {
        throw new ApiError(400, "Rating and comment are required");
    }

    // Validate Rating
    if (rating < 1 || rating > 5) {
        throw new ApiError(400, "Rating must be between 1 and 5");
    }

    // Check Product Exists
    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
        throw new ApiError(404, "Product not found");
    }

    // Check Duplicate Review
    const existingReview = await Review.findOne({
        user,
        product,
    });

    if (existingReview) {
        throw new ApiError(
            400,
            "You have already reviewed this product"
        );
    }

    // Create Review
    const review = await Review.create({
        user,
        product,
        rating,
        comment,
    });

    // Get All Reviews of Product
    const reviews = await Review.find({ product });

    // Calculate Average Rating
    const totalRating = reviews.reduce(
        (sum, item) => sum + item.rating,
        0
    );

    existingProduct.numReviews = reviews.length;

    existingProduct.averageRating =
        totalRating / reviews.length;

    await existingProduct.save();

    res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: review,
    });
});

exports.getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    // Check Product Exists
    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Get Reviews
    const reviews = await Review.find({ product: productId })
        .populate({
            path: "user",
            select: "name",
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Product reviews fetched successfully",
        totalReviews: reviews.length,
        averageRating: product.averageRating,
        data: reviews,
    });
});

exports.updateReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // Validate Review ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Review ID");
    }

    // Find Review
    const review = await Review.findById(id);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Validate Rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
        throw new ApiError(400, "Rating must be between 1 and 5");
    }

    // Update fields
    if (rating !== undefined) {
        review.rating = rating;
    }

    if (comment !== undefined) {
        review.comment = comment;
    }

    await review.save();

    // Get all reviews again to recalculate rating
    const reviews = await Review.find({
        product: review.product,
    });

    const totalRating = reviews.reduce(
        (sum, item) => sum + item.rating,
        0
    );

    // Update Product Rating
    const product = await Product.findById(review.product);

    if (product) {
        product.numReviews = reviews.length;
        product.averageRating = reviews.length
            ? totalRating / reviews.length
            : 0;

        await product.save();
    }

    res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: review,
    });
});

exports.deleteReview = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate Review ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Review ID");
    }

    // Find Review
    const review = await Review.findById(id);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Store Product ID before deleting review
    const productId = review.product;

    // Delete Review
    await Review.findByIdAndDelete(id);

    // Get remaining reviews
    const reviews = await Review.find({
        product: productId,
    });

    const totalRating = reviews.reduce(
        (sum, item) => sum + item.rating,
        0
    );

    // Update Product Rating
    const product = await Product.findById(productId);

    if (product) {
        product.numReviews = reviews.length;

        product.averageRating = reviews.length
            ? totalRating / reviews.length
            : 0;

        await product.save();
    }

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    });
});