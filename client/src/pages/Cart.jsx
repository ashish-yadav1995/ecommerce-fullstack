import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import {
  getCart,
  updateCart,
  removeCartItem,
  clearCart,
} from "../services/cartApi";

function Cart() {
  const navigate = useNavigate();
  const {cart, fetchCart, loading, handleQuantityChange, handleRemoveItem, handleClearCart, grandTotal, actionLoading} = useCart();

  useEffect(() => {
    fetchCart();
  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading cart...</p>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-10 text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

          <p className="text-gray-600 mb-6">Your cart is empty.</p>

          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // CART UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">My Cart</h1>

          <button
            onClick={handleClearCart}
            disabled={actionLoading}
            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {actionLoading ? "Please wait..." : "Clear Cart"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CART ITEMS */}

          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const product = item.product;

              if (!product) {
                return null;
              }

              const image =
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "https://via.placeholder.com/150";

              const subtotal = product.price * item.quantity;

              return (
                <div key={item._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* IMAGE */}

                    <div className="w-full sm:w-32 h-32 flex-shrink-0">
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* PRODUCT INFO */}

                    <div className="flex-1">
                      <div className="flex justify-between gap-4">
                        <div>
                          <h2 className="text-xl font-semibold">
                            {product.name}
                          </h2>

                          <p className="text-gray-500">{product.brand}</p>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(product._id)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>

                      {/* PRICE */}

                      <div className="mt-3">
                        {product.discountPrice > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">
                              ₹{product.discountPrice}
                            </span>

                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      {/* QUANTITY */}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() =>
                              handleQuantityChange(product._id, -1)
                            }
                            disabled={actionLoading || item.quantity <= 1}
                            className="px-4 py-2 text-xl hover:bg-gray-100 disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="px-5 py-2 border-x font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleQuantityChange(product._id, 1)}
                            disabled={
                              actionLoading || item.quantity >= product.stock
                            }
                            className="px-4 py-2 text-xl hover:bg-gray-100 disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>

                        {/* SUBTOTAL */}

                        <div className="text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>

                          <p className="text-xl font-bold">₹{subtotal}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 mt-2">
                        Available stock: {product.stock}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ORDER SUMMARY */}

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Items</span>

                <span>
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Subtotal</span>

                <span>₹{grandTotal}</span>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>

                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                disabled={cart.length === 0}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center mt-4 text-blue-600 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
