import React, { useState } from "react";

function Wishlist() {
  // ----------------------------------------------------
  // Mock State UI Testing ke liye
  // ----------------------------------------------------
  const [wishlistItems, setWishlistItems] = useState([
    {
      _id: "p1",
      title: "Minimalist Leather Sneakers",
      category: "Footwear",
      price: 3499,
      images: [
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
      ],
    },
    {
      _id: "p2",
      title: "Wireless Over-Ear Headphones",
      category: "Electronics",
      price: 5999,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      ],
    },
    {
      _id: "p3",
      title: "Classic Oversized Cotton Hoodie",
      category: "Apparel",
      price: 1999,
      images: [
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
      ],
    },
  ]);

  // UI Handlers (Mock Triggers)
  const handleRemoveFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleMoveToCart = (product) => {
    alert(`"${product.title}" moved to cart successfully!`);
    handleRemoveFromWishlist(product._id);
  };

  // ----------------------------------------------------
  // 1. EMPTY STATE UI (Jab saare items remove ho jayein)
  // ----------------------------------------------------
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
  // 2. MAIN WISHLIST GRID UI
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-200/60 pb-5">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              My Wishlist
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1">
              You have <span className="text-black font-bold">{wishlistItems.length}</span> items saved
            </p>
          </div>

          <button
            onClick={() => alert("Explore products clicked")}
            className="text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-black transition-colors hidden sm:block"
          >
            Continue Shopping →
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
            >
              {/* Delete / Remove Icon Button */}
              <button
                onClick={() => handleRemoveFromWishlist(product._id)}
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
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="px-1 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="font-black text-lg text-black mt-2">
                    ₹{Number(product.price).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Move to Cart Button */}
              <button
                onClick={() => handleMoveToCart(product)}
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