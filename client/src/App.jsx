import React from "react";
import { Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/verifyOtp";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";

// User Protected Pages
import Checkout from "./pages/Checkout";
import Ordersuccess from "./pages/Ordersuccess";
import TrackOrder from "./pages/TrackOrder";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import Wishlist from "./pages/Wishlist";

// Admin & Seller Pages
import AdminHome from "./pages/Dashboard/AdminHome";
import AdminUsers from "./pages/Dashboard/AdminUsers";
import AdminProducts from "./pages/Dashboard/AdminProducts";
import AdminOrderDetail from "./pages/Dashboard/AdminOrderDetail";
import AdminReviews from "./pages/Dashboard/AdminReviews";

import SellerHome from "./pages/Dashboard/SellerHome";
import AddProductDashboard from "./pages/Dashboard/AddProductDashboard";
import MyProductsDashboard from "./pages/Dashboard/MyProductsDashboard";
import SellerOrders from "./pages/Dashboard/SellerOrders";
import SellerProductDetail from "./pages/Dashboard/SellerProductDetail";
import EditProduct from "./pages/Dashboard/EditProduct";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    // 👇 Global Wrapper: Horizontal scroll aur mobile screen break hone se bachayega
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden w-full">
      <Navbar />

      <main className="flex-grow w-full">
        <Routes>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/productdetail" element={<ProductDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* ================= GUEST ONLY ROUTES ================= */}
          <Route
            path="/login"
            element={
              <ProtectedRoute guestOnly={true}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute guestOnly={true}>
                <Signup />
              </ProtectedRoute>
            }
          />

          {/* ================= USER PROTECTED ROUTES ================= */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <Ordersuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trackorder/:id"
            element={
              <ProtectedRoute>
                <TrackOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-details/:id"
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminOrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute role="admin">
                <AdminProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute role="admin">
                <AdminReviews />
              </ProtectedRoute>
            }
          />

          {/* ================= SELLER ROUTES ================= */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute role="seller">
                <SellerHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/add-product"
            element={
              <ProtectedRoute role="seller">
                <AddProductDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products"
            element={
              <ProtectedRoute role="seller">
                <MyProductsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/edit-product/:id"
            element={
              <ProtectedRoute role="seller">
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/orders"
            element={
              <ProtectedRoute role="seller">
                <SellerOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/products/:id"
            element={
              <ProtectedRoute role="seller">
                <SellerProductDetail />
              </ProtectedRoute>
            }
          />

          {/* ================= 404 CATCH ALL ================= */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-[60vh] text-xl font-semibold text-gray-600">
                Page Not Found (404)
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;