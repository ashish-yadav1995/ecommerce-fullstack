const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const categoryRoutes = require("./routes/categoryRoute");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const addressRoutes = require("./routes/addressRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use("/api/v1/products", productRoutes);

app.use("/api/v1/cart", cartRoutes);

app.use("/api/v1/wishlist", wishlistRoutes);

app.use("/api/v1/address", addressRoutes);

app.use("/api/v1/order", orderRoutes);

app.use("/api/v1/reviews", reviewRoutes);

app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

app.use(errorHandler);

module.exports = app;
