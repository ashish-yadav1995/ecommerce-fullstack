// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { addToCart } from "../services/cartApi";

// function ProductCard({ product }) {
//   const { handleAddToCart } = useCart();

//   // const handleAddToCart = async (product) => {
//   //   try {
//   //     const response = await addToCart(product._id, { quantity: 1 });
//   //     alert(response.message || "Product added to cart successfully!");
//   //   } catch (error) {
//   //     alert("Failed to add product to cart. Please try again.");
//   //   }
//   // };

//   return (
//     <div className="bg-white rounded-xl shadow hover:shadow-xl transition p-4 flex flex-col h-full border border-gray-100">
//       {/* Image Section */}
//       <Link to="/productdetail" state={{ id: product._id }}>
//         <div>
//           <div className="relative">
//             <img
//               src={product.images[0]} // images array hai toh first image lo
//               alt={product.name}
//               className="h-48 w-full object-contain mb-4"
//             />
//             {/* Discount Badge (Optional but looks good) */}
//             {product.discountPrice && product.price > product.discountPrice && (
//               <span>
//                 {Math.round(
//                   ((product.price - product.discountPrice) / product.price) *
//                     100,
//                 )}
//                 % OFF
//               </span>
//             )}
//           </div>

//           {/* Product name */}
//           <h3 className="text-sm font-semibold mb-1 text-gray-800">
//             {product.name.length > 40
//               ? product.name.slice(0, 40) + "..."
//               : product.name}
//           </h3>

//           {/* ⭐ Rating & Reviews Section */}
//           <div className="flex items-center gap-2 mb-3">
//             {/* Rating Badge */}
//             <div className="flex items-center bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold">
//               {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
//               <span className="ml-0.5">★</span>
//             </div>

//             {/* Review Count */}
//             <span className="text-xs text-gray-500 font-medium">
//               ({product.numReviews || 0} reviews)
//             </span>
//           </div>

//           {/* Price Section */}
//           <div className="flex items-baseline gap-2 mb-4">
//             <p className="text-xl font-bold text-gray-900">₹ {product.price}</p>
//             <p className="text-xs text-gray-400 line-through">
//               ₹ {(product.price * 1.1).toFixed(2)}
//             </p>
//           </div>

//           {/* Availability Status */}
//           <p
//             className={`text-[10px] font-bold mb-3 uppercase ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
//           >
//             {/* <span>{product.isActive ? 'Available' : 'Unavailable'}</span> */}
//             <span>
//               {product.stock > 0
//                 ? `In Stock (${product.stock})`
//                 : "Out of Stock"}
//             </span>
//           </p>
//         </div>
//       </Link>
//       {/* Action Button */}
//       <button
//         onClick={() => handleAddToCart(product)}
//         disabled={product.stock === 0}
//         className={`mt-auto w-full py-2.5 rounded-lg font-semibold transition-all ${
//           product.stock > 0
//             ? "bg-black text-white hover:bg-gray-800 active:scale-95"
//             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//         }`}
//       >
//         {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
//       </button>
//     </div>
//   );
// }

// export default ProductCard;
// ===========================================================

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { handleAddToCart } = useCart();
  const { Wishlist, toggleWishlist, isInWishlist } = useWishList();

  // Check karein ki current product wishlist me pehle se hai ya nahi
  const isWishlisted = isInWishlist
    ? isInWishlist(product._id)
    : Wishlist?.some(
        (item) => (item.product?._id || item._id) === product._id,
      );

  // Heart Icon Click Handler
  const handleWishlistClick = (e) => {
    e.preventDefault(); // Link click trigger hone se rokne ke liye
    e.stopPropagation(); // Event bubbling rokne ke liye

    if (toggleWishlist) {
      toggleWishlist(product);
    } else {
      console.log("Toggle Wishlist Triggered for:", product.name);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition p-4 flex flex-col h-full border border-gray-100 relative group">
      {/* 1. ❤️ Wishlist Floating Button (Top-Right Corner) */}
      <button
        onClick={handleWishlistClick}
        type="button"
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-md hover:scale-110 transition-all text-gray-400 hover:text-red-500"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <svg
          className={`w-5 h-5 transition-colors ${
            isWishlisted
              ? "fill-red-500 stroke-red-500"
              : "fill-none stroke-currentColor"
          }`}
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {/* 2. Product Detail Link & Content */}
      <Link
        to="/productdetail"
        state={{ id: product._id }}
        className="flex-1 flex flex-col"
      >
        {/* Image Section */}
        <div className="relative">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="h-48 w-full object-contain mb-4 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          {product.discountPrice && product.price > product.discountPrice && (
            <span className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-r-full">
              {Math.round(
                ((product.price - product.discountPrice) / product.price) * 100,
              )}
              % OFF
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-sm font-semibold mb-1 text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        {/* ⭐ Rating & Reviews Section */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold">
            {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
            <span className="ml-0.5">★</span>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            ({product.numReviews || 0} reviews)
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-2 mt-auto">
          <p className="text-xl font-bold text-gray-900">₹ {product.price}</p>
          {product.discountPrice && (
            <p className="text-xs text-gray-400 line-through">
              ₹ {product.discountPrice}
            </p>
          )}
        </div>

        {/* Availability Status */}
        <p
          className={`text-[10px] font-bold mb-3 uppercase ${
            product.stock > 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </p>
      </Link>

      {/* 3. Action Button */}
      <button
        onClick={() => handleAddToCart(product)}
        disabled={product.stock === 0}
        className={`mt-auto w-full py-2.5 rounded-lg font-semibold transition-all ${
          product.stock > 0
            ? "bg-black text-white hover:bg-gray-800 active:scale-95 shadow-md shadow-gray-200"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
      </button>
    </div>
  );
}

export default ProductCard;
