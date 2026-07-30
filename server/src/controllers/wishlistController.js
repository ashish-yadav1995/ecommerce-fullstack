const  mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError")
const Product = require("../models/Product")
const Wishlist = require("../models/Wishlist")


exports.addToWishlist = asyncHandler(async (req, res) => {

    const { user, product } = req.body;

    // Validate User ID
    if (!mongoose.Types.ObjectId.isValid(user)) {
        throw new ApiError(400, "Invalid User ID");
    }

    // Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(product)) {
        throw new ApiError(400, "Invalid Product ID");
    }

    // Check Product Exists
    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
        throw new ApiError(404, "Product not found");
    }

    // Check Product Active
    if (!existingProduct.isActive) {
        throw new ApiError(400, "Product is unavailable");
    }

    // Already Exists In Wishlist
    const existingWishlist = await Wishlist.findOne({
        user,
        product,
    });

    if (existingWishlist) {
        throw new ApiError(400, "Product already exists in wishlist");
    }

    // Create Wishlist
    const wishlist = await Wishlist.create({
        user,
        product,
    });

    res.status(201).json({
        success: true,
        message: "Product added to wishlist successfully",
        data: wishlist,
    });

});

exports.getWishlist = asyncHandler(async (req, res) => {

    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid User ID");
    }

    const wishlist = await Wishlist.find({ user: userId })
        .populate({
            path: "product",
            select: "-__v",
            populate: {
                path: "category",
                select: "name",
            },
        });

    res.status(200).json({
        success: true,
        message: "Wishlist fetched successfully",
        totalItems: wishlist.length,
        data: wishlist,
    });

});

exports.removeWishlistItem = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Wishlist ID");
    }

    const wishlist = await Wishlist.findById(id);

    if (!wishlist) {
        throw new ApiError(404, "Wishlist item not found");
    }

    await Wishlist.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Wishlist item removed successfully",
    });

});

exports.clearWishlist = asyncHandler(async (req, res) => {

    const { user } = req.body;

    if (!mongoose.Types.ObjectId.isValid(user)) {
        throw new ApiError(400, "Invalid User ID");
    }

    const wishlist = await Wishlist.find({ user });

    if (wishlist.length === 0) {
        throw new ApiError(404, "Wishlist is already empty");
    }

    await Wishlist.deleteMany({ user });

    res.status(200).json({
        success: true,
        message: "Wishlist cleared successfully",
    });

});