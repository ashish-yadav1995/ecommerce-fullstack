import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishlistContext";

function Savetocart({ cart, movetocarthandler, deletehandler }) {
  const { addToCart } = useCart();
  const {Wishlist, addToWishlist, removeFromWishlist} = useWishList()
  // Agar saved items zero hain toh section hi mat dikhao ya empty message dikhao
  if (Wishlist.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t-2 border-dashed border-gray-200">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-black text-gray-800">Saved for Later</h2>
        <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
          {Wishlist.length} Items
        </span>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Wishlist.map((product) => (
          <div
            key={product.id}
            className="flex flex-col bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <Link to="/productdetail" state={{ product }}>
              {/* Image Section */}
              <div className="h-36 w-full flex justify-center items-center mb-4 bg-gray-50 rounded-xl p-2">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 text-center">
                <h4 className="font-bold text-gray-700 text-sm mb-1 h-10 overflow-hidden line-clamp-2 px-2">
                  {product.title}
                </h4>
                <p className="font-black text-lg text-gray-900 mt-2">
                  ₹{product.price}
                </p>
              </div>
            </Link>

            {/* Action Buttons Container */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
              {/* Move to Cart Button */}
              <button
                className="flex-1 bg-black text-white text-xs font-black py-3 rounded-xl hover:bg-gray-800 transition-all active:scale-95 uppercase tracking-tighter"
                onClick={() => {
                  addToCart(product);
                  removeFromWishlist(product.id);
                }}
              >
                Move to Cart
              </button>

              {/* Delete Button (Icon Style) */}
              <button
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Remove"
                onClick={() => removeFromWishlist(product.id)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Savetocart;