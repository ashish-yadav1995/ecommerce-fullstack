const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.addToCart = asyncHandler(async (req, res) => {
  const { user, product, quantity = 1 } = req.body;

  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(user)) {
    throw new ApiError(400, "Invalid User ID");
  }

  if (!mongoose.Types.ObjectId.isValid(product)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  // Quantity Validation
  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  // Product Exists
  const existingProduct = await Product.findById(product);

  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  // Product Active
  if (!existingProduct.isActive) {
    throw new ApiError(400, "Product is unavailable");
  }

  // Stock Check
  if (quantity > existingProduct.stock) {
    throw new ApiError(400, "Insufficient stock");
  }

  // Already in Cart?
  let cartItem = await Cart.findOne({
    user,
    product,
  });

  if (cartItem) {
    const newQuantity = cartItem.quantity + quantity;

    if (newQuantity > existingProduct.stock) {
      throw new ApiError(400, "Requested quantity exceeds available stock");
    }

    cartItem.quantity = newQuantity;

    await cartItem.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cartItem,
    });
  }

  // Create Cart Item
  cartItem = await Cart.create({
    user,
    product,
    quantity,
  });

  res.status(201).json({
    success: true,
    message: "Product added to cart successfully",
    data: cartItem,
  });
});

exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }
  // Get Cart
  const cartItems = await Cart.find({ user: userId }).populate({
    path: "product",
    populate: {
      path: "category",
      select: "name",
    },
  });

  if (!cartItems.length) {
    return res.status(200).json({
      success: true,
      message: "Cart is empty",
      totalItems: 0,
      grandTotal: 0,
      data: [],
    });
  }

  let grandTotal = 0;

  const data = cartItems.map((item) => {
    const subtotal = item.product.price * item.quantity;

    grandTotal += subtotal;

    return {
      _id: item._id,
      quantity: item.quantity,
      subtotal,

      product: {
        _id: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        brand: item.product.brand,
        price: item.product.price,
        discountPrice: item.product.discountPrice,
        images: item.product.images,
        stock: item.product.stock,
        category: item.product.category,
      },
    };
  });

  res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    totalItems: cartItems.length,
    grandTotal,
    data,
  });
});

exports.updateCart = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  // Validate Cart ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Cart ID");
  }

  // Validate Quantity
  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  // Find Cart Item
  const cartItem = await Cart.findById(id).populate("product");

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  // Product Active Check
  if (!cartItem.product.isActive) {
    throw new ApiError(400, "Product is unavailable");
  }

  // Stock Check
  if (quantity > cartItem.product.stock) {
    throw new ApiError(400, "Requested quantity exceeds available stock");
  }

  // Update Quantity
  cartItem.quantity = quantity;

  await cartItem.save();

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cartItem,
  });
});

exports.removeCartItem = asyncHandler(async (req, res) => {

    const { id } = req.params;

    // Validate Cart ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Cart ID");
    }

    // Check Cart Item
    const cartItem = await Cart.findById(id);

    if (!cartItem) {
        throw new ApiError(404, "Cart item not found");
    }

    // Delete Item
    await Cart.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
    });

});

exports.clearCart = asyncHandler(async (req, res) => {

    const { user } = req.body;

    // Validate User ID
    if (!mongoose.Types.ObjectId.isValid(user)) {
        throw new ApiError(400, "Invalid User ID");
    }

    // Check Cart
    const cartItems = await Cart.find({ user });

    if (cartItems.length === 0) {
        throw new ApiError(404, "Cart is already empty");
    }

    // Delete All Items
    await Cart.deleteMany({ user });

    res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
    });

});