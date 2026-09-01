const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/ApiError");
const Product = require("../models/Product");
const Address = require("../models/Address");
const Order = require("../models/Order");
const Cart = require("../models/Cart")


exports.placeOrder = asyncHandler(async (req, res) => {
  const { user, shippingAddress, paymentMethod } = req.body;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(user)) {
    throw new ApiError(400, "Invalid User ID");
  }

  // Validate Address ID
  if (!mongoose.Types.ObjectId.isValid(shippingAddress)) {
    throw new ApiError(400, "Invalid Address ID");
  }

  // Address Exists
  const address = await Address.findById(shippingAddress);

  if (!address) {
    throw new ApiError(404, "Shipping address not found");
  }

  // User Cart
  const cartItems = await Cart.find({ user }).populate("product");

  if (cartItems.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  let orderItems = [];
  let itemsPrice = 0;

  for (const item of cartItems) {
    const product = item.product;

    if (!product.isActive) {
      throw new ApiError(400, `${product.name} is unavailable`);
    }

    if (item.quantity > product.stock) {
      throw new ApiError(400, `${product.name} is out of stock`);
    }

    const price = product.discountPrice || product.price;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0] || "",
      price,
      quantity: item.quantity,
      totalPrice: price * item.quantity,
    });

    itemsPrice += price * item.quantity;
  }

  const shippingPrice = 0;
  const taxPrice = 0;

  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user,

    orderItems,

    shippingAddress,

    itemsPrice,

    shippingPrice,

    taxPrice,

    totalPrice,

    paymentMethod,
  });

  // Reduce Stock
  for (const item of cartItems) {
    item.product.stock -= item.quantity;

    await item.product.save();
  }

  // Clear Cart
  await Cart.deleteMany({ user });

  res.status(201).json({
    success: true,

    message: "Order placed successfully",

    data: order,
  });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate User ID
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  // Get Orders
  const orders = await Order.find({ user: userId })
    .populate("shippingAddress")
    .sort({ createdAt: -1 });

  if (orders.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No orders found",
      totalOrders: 0,
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    totalOrders: orders.length,
    data: orders,
  });
});

exports.getOrderById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    // Validate Order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Order ID");
    }

    // Find Order
    const order = await Order.findById(id)
        .populate({
            path: "shippingAddress",
            select: "-__v",
        })
        .populate({
            path: "user",
            select: "name email",
        })
        .populate({
            path: "orderItems.product",
            select: "name slug brand images",
        });

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        data: order,
    });

});

exports.cancelOrder = asyncHandler(async(req,res)=>{

const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(user)) {
    throw new ApiError(400, "Invalid User ID");
  }

  const order = await Order.findById(id)

   if (!order) {
    throw new ApiError(400, "order not found");
  }

if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered" || order.orderStatus === "Cancelled") {
    throw new ApiError(400, "you can not cancelled this product");
  }

// if (order.orderStatus === "Pending" || order.orderStatus === "Confirmed" || order.orderStatus === "Processing") {

order.orderStatus = "Cancelled"

  order.save();

  res.status(200).json({
    success:true,
    message:"order cancel successfully!",
    data:order
  })

  // }
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Validate Order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Order ID");
    }

    // Validate Status
    if (!orderStatus) {
        throw new ApiError(400, "Order status is required");
    }

    const validStatuses = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
    ];

    if (!validStatuses.includes(orderStatus)) {
        throw new ApiError(400, "Invalid order status");
    }

    // Find Order
    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    // Cancelled order should not be updated
    if (order.orderStatus === "Cancelled") {
        throw new ApiError(400, "Cancelled order cannot be updated");
    }

    // Delivered order should not be updated
    if (order.orderStatus === "Delivered") {
        throw new ApiError(400, "Delivered order cannot be updated");
    }

    // Update status
    order.orderStatus = orderStatus;

    // If delivered
    if (orderStatus === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order,
    });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find()
        .populate({
            path: "user",
            select: "name email",
        })
        .populate({
            path: "shippingAddress",
            select: "fullName mobile city state postalCode",
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "All orders fetched successfully",
        totalOrders: orders.length,
        data: orders,
    });
});