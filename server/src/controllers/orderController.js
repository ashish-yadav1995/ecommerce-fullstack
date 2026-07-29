const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");
const Product = require("../models/Product");
const Address = require("../models/Address");
const Order = require("../models/Order");

exports.placeOrder = asyncHandler(async (req, res) => {
  const { userId, productId, address, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");

    if (!address) {
      throw new ApiError(400, "address not be empty");
    }
  }
  const item = await Product.findById(productId);

  if (!item) {
    throw new ApiError(400, "product not found");
  }

  if (quantity > item.stock) {
    throw new ApiError(400, "insufficient stock");
  }

  //   const address = await Address.findById()
  const order = await Order.create({
    user: userId,
    product: productId,
    address,
    quantity,
  });

  res.status(200).json({
    success: true,
    message: "order placed successfully",
    data: order,
  });
});
