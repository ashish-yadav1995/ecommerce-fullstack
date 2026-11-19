import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishlistContext";

function ProductCard({ product }) {
  const { handleAddToCart } = useCart();
  const { addItem, removeItem, isInWishlist } = useWishList();

  const isWishlisted = isInWishlist(product._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeItem(product._id);
    } else {
      addItem(product._id);
    }
  };

  // discountPrice is treated as the discount amount off product.price
  const hasDiscount =
    product.discountPrice &&
    product.discountPrice > 0 &&
    product.price > product.discountPrice;

  const finalPrice = hasDiscount
    ? product.price - product.discountPrice
    : product.price;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition p-3 sm:p-4 flex flex-col h-full border border-gray-100 relative group w-full">
      {/* 1. ❤️ Wishlist Floating Button */}
      <button
        onClick={handleWishlistClick}
        type="button"
        className="absolute top-2.5 right-2.5 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-md shadow-md hover:scale-110 hover:bg-red-50 transition-all"
        title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${isWishlisted
              ? "fill-red-500 stroke-red-500 scale-105"
              : "fill-none stroke-gray-500 group-hover:stroke-red-500"
            }`}
          viewBox="0 0 24 24"
          strokeWidth="2.5"
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
        <div className="relative overflow-hidden rounded-lg mb-3">
          <img
            src={product.images?.[0] || "/placeholder.jpg"}
            alt={product.name}
            className="h-40 sm:h-48 w-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-r-full">
              {Math.round((product.discountPrice / product.price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-sm sm:text-base font-semibold mb-1 text-gray-800 line-clamp-2">
          {product.name}
        </h3>

        {/* ⭐ Rating & Reviews Section */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2.5">
          <div className="flex items-center bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold">
            {product.averageRating ? product.averageRating.toFixed(1) : "0.0"}
            <span className="ml-0.5">★</span>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            ({product.numReviews || 0} reviews)
          </span>
        </div>

        {/* Price Section */}
        <div className="flex flex-wrap items-baseline gap-2 mb-1.5 mt-auto">
          <p className="text-lg sm:text-xl font-bold text-gray-900">
            ₹ {finalPrice}
          </p>
          {hasDiscount && (
            <>
              <p className="text-xs text-gray-400 line-through">
                ₹ {product.price}
              </p>
              <span className="text-[11px] font-semibold text-green-600">
                Save ₹ {product.discountPrice}
              </span>
            </>
          )}
        </div>

        {/* Availability Status */}
        <p
          className={`text-[10px] font-bold mb-3 uppercase ${product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
        >
          {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
        </p>
      </Link>

      {/* 3. Action Button */}
      <button
        onClick={() => handleAddToCart(product)}
        disabled={product.stock === 0}
        className={`mt-auto w-full py-2 sm:py-2.5 text-sm sm:text-base rounded-lg font-semibold transition-all ${product.stock > 0
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