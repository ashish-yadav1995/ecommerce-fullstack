const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
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
const adminRoutes = require("./routes/adminRoutes");
const app = express();

 app.use(helmet())

 app.use(cors())

// app.use(express.json());

// src/app.js me check aur change karein:
app.use(express.json({ limit: "10kb" })); // 👈 10kb se badi payload aate hi block ho jayegi
app.use(express.urlencoded({ extended: true, limit: "10kb" }));


const apiLimiter = rateLimit({
  windowMs:15*60*1000,
  max:100,

  mesaage:{
    success:false,
    mesaage:"Too many requests. Please try again later"
  }
})

app.use("/api", apiLimiter);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use("/api/v1/products", productRoutes);

app.use("/api/v1/cart", cartRoutes);

app.use("/api/v1/wishlist", wishlistRoutes);

app.use("/api/v1/address", addressRoutes);

app.use("/api/v1/order", orderRoutes);

app.use("/api/v1/reviews", reviewRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

app.use(errorHandler);

module.exports = app;

// ================================================================================

//  Universal Rule (Hamesha yaad rakhne ke liye)Ownership check tab lagaya jata hai jab:Aap koi aesa operation kar rahe hain jo pehle se maujood data (Existing Resource) ko target kar raha hai.Us data ko target karne ke liye frontend se koi Dynamic ID (req.params ya req.body me) backend par aa rahi hai.Agar aap naya data bana rahe hain (POST / bina kisi purani ID ke), ya fir direct token se data filter kar rahe hain (Address.find({ user: req.user._id })), toh ownership check ki bilkul zaroorat nahi hoti.Bhai, ab aapka ownership validation ka logic poori tarah se crystal clear ho chuka hai!Ab hamara agla mission kya hoga?Kya hum ab naye schema ke mutabik core functionality Place Order API (placeOrder) ka Mongoose transaction aur controller code design karein?Ya fir aap abhi Address API ke saare controllers ko ek baar final code me assemble karna chahte hain?
