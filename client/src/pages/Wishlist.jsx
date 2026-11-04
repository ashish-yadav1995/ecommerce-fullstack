import React, { useState } from "react";
import { useWishList } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link,useNavigate } from "react-router-dom";

function Wishlist() {

  const { wishlistItems, setWishlistItems, removeItem, clearAll } = useWishList();
  const { handleAddToCart } = useCart()
  const navigate = useNavigate();



  const handleMoveToCart = async (product) => {
    alert(`"${product.name}" moved to cart successfully!`);
    const isRemove = await removeItem(product._id);
    if (isRemove) {
      handleAddToCart(product)
    }
  };


  // ----------------------------------------------------
  // 1. EMPTY STATE UI (Jab saare items remove ho jayein)
  // ----------------------------------------------------
// Agar wishlist khali ho toh yeh section dikhega
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gray-50/50">
        <div className="text-center max-w-sm">
          {/* Animated Heart Ring */}
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
            Explore our collection and save your favorite items here to buy later!
          </p>

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
          >
            Reset Demo Items
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. MAIN WISHLIST GRID UI (With Clear All Button in Header)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-gray-200/60 pb-5 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              My Wishlist
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              You have <span className="text-black font-bold">{wishlistItems.length}</span> items saved
            </p>
          </div>

          {/* Right Section: Continue Shopping & Clear All Button */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <Link
              to="/"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Continue Shopping
            </Link>

            {/* Clear All Button */}
            {wishlistItems.length > 0 && (
              <button
                onClick={async () => {
                  if (window.confirm("Are you sure you want to empty your wishlist?")) {
                    try {
                      await clearAll();
                    } catch (error) {
                      console.error("Failed to clear wishlist:", error);
                    }
                  }
                }}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border border-red-200/60 flex items-center gap-1.5 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.product._id}
              className="group bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
            >
              {/* Delete / Remove Icon Button */}
              <button
                onClick={() => removeItem(item.product._id || item.product)}
                className="absolute top-6 right-6 z-10 w-9 h-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
                title="Remove from Wishlist"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Top Details */}
              <div>
                {/* Image */}
                <div className="w-full h-56 bg-gray-100 rounded-2xl overflow-hidden mb-4 relative">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="px-1 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                    {item.product.category?.name || "Category"}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="font-black text-lg text-black mt-2">
                    ₹{Number(item.product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Move to Cart Button */}
              <button
                onClick={() => handleMoveToCart(item.product)}
                className="w-full py-3.5 px-4 bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all shadow-md shadow-gray-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Move to Cart
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Wishlist;