const mongoose = require("mongoose");

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.addToCart = asyncHandler(async (req, res) => {
  const user = req.user._id; // Authenticated user ID
  const { productId, quantity = 1 } = req.body;
  console.log("running===========addToCart",user, productId, quantity   );

  

  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(user)) {
    throw new ApiError(400, "Invalid User ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  // Quantity Validation
  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  // Product Exists
  const existingProduct = await Product.findById(productId);

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
    product: productId,
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
    product: productId,
    quantity,
  });

  res.status(201).json({
    success: true,
    message: "Product added to cart successfully",
    data: cartItem,
  });
});

exports.getCart = asyncHandler(async (req, res) => {
  // const userId = req.params.id;
  const userId = req.user._id; // Authenticated user ID

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

// exports.updateCart = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { quantity } = req.body;

//   // Validate Cart ID
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid Cart ID");
//   }

//   // Validate Quantity
//   if (!quantity || quantity < 1) {
//     throw new ApiError(400, "Quantity must be at least 1");
//   }

//   // Find Cart Item
//   const cartItem = await Cart.findById(id).populate("product");

//   if (!cartItem) {
//     throw new ApiError(404, "Cart item not found");
//   }

//   // Product Active Check
//   if (!cartItem.product.isActive) {
//     throw new ApiError(400, "Product is unavailable");
//   }

//   // Stock Check
//   if (quantity > cartItem.product.stock) {
//     throw new ApiError(400, "Requested quantity exceeds available stock");
//   }

//   // Update Quantity
//   cartItem.quantity = quantity;

//   await cartItem.save();

//   res.status(200).json({
//     success: true,
//     message: "Cart updated successfully",
//     data: cartItem,
//   });
// });

// exports.updateCart = asyncHandler(async (req, res) => {
//   const { id } = req.params; // Product ID ya Cart Document ID
//   const { quantity } = req.body; // Frontend se aa raha hai: +1 ya -1
//   const userId = req.user._id;

//   // 1. ID Validation
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid ID");
//   }

//   // 2. Quantity Change Validation
//   if (typeof quantity !== "number" || quantity === 0) {
//     throw new ApiError(400, "Quantity increment/decrement value is required");
//   }

//   // 3. User aur Product ID (ya Cart ID) match karke item search karein
//   let cartItem = await Cart.findOne({
//     $or: [{ _id: id }, { product: id }],
//     user: userId,
//   }).populate("product");

//   if (!cartItem) {
//     throw new ApiError(404, "Cart item not found");
//   }

//   // 4. Product Active Check
//   if (!cartItem.product || !cartItem.product.isActive) {
//     throw new ApiError(400, "Product is currently unavailable");
//   }

//   // 5. Nayi Quantity Calculate karein (Current + Delta)
//   const newQuantity = cartItem.quantity + quantity;

//   // 6. Minimum Quantity Guardrail
//   if (newQuantity < 1) {
//     throw new ApiError(
//       400,
//       "Quantity cannot be less than 1. Use remove to delete item.",
//     );
//   }

//   // 7. Stock Availability Check
//   if (newQuantity > cartItem.product.stock) {
//     throw new ApiError(
//       400,
//       `Requested quantity exceeds available stock (${cartItem.product.stock} available)`,
//     );
//   }

//   // 8. Update and Save
//   cartItem.quantity = newQuantity;
//   await cartItem.save();

//   // 9. Fetch updated full cart list for clean frontend state update
//   const remainingCart = await Cart.find({ user: userId }).populate("product");

//   res.status(200).json({
//     success: true,
//     message: "Cart updated successfully",
//     updatedItem: cartItem,
//     cart: remainingCart,
//   });
// });

exports.updateCart = asyncHandler(async (req, res) => {
  const { id } = req.params; // Product ID ya Cart Document ID
  const { quantity } = req.body.quantity; // Frontend se aayega: +1, -1, "1", ya "-1"
  const userId = req.user._id;

  // 1. ID Validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID");
  }

  // 2. Quantity Parsing & Safe Validation
  const parsedQuantity = Number(quantity);

  console.log("Original Quantity:", quantity);
  console.log(
    "Parsed Quantity:",
    parsedQuantity,
    "Type:",
    typeof parsedQuantity,
  );

  if (isNaN(parsedQuantity) || parsedQuantity === 0) {
    throw new ApiError(400, "Valid quantity change (+1 or -1) is required");
  }

  // 3. User aur Product ID (ya Cart ID) match karke item search karein
  let cartItem = await Cart.findOne({
    $or: [{ _id: id }, { product: id }],
    user: userId,
  }).populate("product");

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  // 4. Product Active Check
  if (!cartItem.product || !cartItem.product.isActive) {
    throw new ApiError(400, "Product is currently unavailable");
  }

  // 5. Nayi Quantity Calculate karein (Current + Delta)
  const newQuantity = cartItem.quantity + parsedQuantity;

  // 6. Minimum Quantity Guardrail
  if (newQuantity < 1) {
    throw new ApiError(
      400,
      "Quantity cannot be less than 1. Use remove to delete item.",
    );
  }

  // 7. Stock Availability Check
  if (newQuantity > cartItem.product.stock) {
    throw new ApiError(
      400,
      `Requested quantity exceeds available stock (${cartItem.product.stock} available)`,
    );
  }

  // 8. Update and Save
  cartItem.quantity = newQuantity;
  await cartItem.save();

  // 9. Fetch updated full cart list for clean frontend state update
  const remainingCart = await Cart.find({ user: userId }).populate("product");

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    updatedItem: cartItem,
    cart: remainingCart,
  });
});
// exports.removeCartItem = asyncHandler(async (req, res) => {
//   const { id } = req.params; // Product ID
//   const userId = req.user._id; // Logged-in user ki ID (protect middleware se)

//   // 1. Product ID Validation
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid Product ID");
//   }
//   // 2. Cart se specific Product ID wala item remove karein
//   const updatedCart = await Cart.findOneAndUpdate(
//     { user: userId },
//     { $pull: { items: { product: id } } }, // items array se match hone wala product pull karein
//     { new: true }
//   ).populate("product");

//   if (!updatedCart) {
//     throw new ApiError(404, "Cart not found");
//   }

//   res.status(200).json({
//     success: true,
//     message: "Cart item removed successfully",
//     cart: updatedCart,
//   });
// });

// exports.removeCartItem = asyncHandler(async (req, res) => {
//   const { id } = req.params; // Product ID
//   const userId = req.user._id; // Logged-in user ki ID

//   console.log("Removing cart item for user:", userId, "Product ID:", id);

//   // 1. Product ID Validation
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     throw new ApiError(400, "Invalid Product ID");
//   }

//   // 2. Direct user ID aur product ID match karke Cart document delete karein
//   if (!(await Cart.findOneAndDelete({ user: userId, product: id }))) {
//     throw new ApiError(404, "Cart item not found or already deleted");
//   }

//   // 3. Check agar item DB mein tha hi nahi
//   if (!deletedItem) {
//     throw new ApiError(404, "Cart item not found or already deleted");
//   }

//   // 4. Remaining cart items fetch karke response me bhejein
//   const remainingCart = await Cart.find({ user: userId }).populate("product");

//   res.status(200).json({
//     success: true,
//     message: "Cart item removed successfully",
//     deletedItemId: deletedItem._id,
//     cart: remainingCart,
//   });
// });

exports.removeCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params; // Product ID
  const userId = req.user._id; // Logged-in user ki ID

  // 1. Product ID Validation
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Product ID");
  }

  // 2. Cart document delete karein aur variable me store karein
  const deletedItem = await Cart.findOneAndDelete({
    user: userId,
    product: id,
  });

  // 3. Check agar item DB me nahi mila
  if (!deletedItem) {
    throw new ApiError(404, "Cart item not found or already deleted");
  }

  // 4. Remaining cart items fetch karein
  const remainingCart = await Cart.find({ user: userId }).populate("product");

  // 5. Response send karein
  res.status(200).json({
    success: true,
    message: "Cart item removed successfully",
    deletedItemId: deletedItem._id,
    cart: remainingCart,
  });
});

exports.clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  // Single DB Call: Direct delete and check deletedCount
  const result = await Cart.deleteMany({ user: userId });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "Cart is already empty");
  }

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
});
