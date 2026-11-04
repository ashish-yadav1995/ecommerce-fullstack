import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
// import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const { getTotalItems } = useCart();
  const { user } = useAuth();
  // const { wishlistItems } = useWishlist();

  // Safely calculate cart count (function ho ya variable/array)
  const cartCount = typeof getTotalItems === "function" ? getTotalItems() : (getTotalItems || 0);
  // const wishlistCount = wishlistItems?.length || 0;
  const wishlistCount =  0;

  return (
    <nav className="sticky top-0 z-50 bg-black text-white px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Brand Logo */}
      <h1 className="text-xl font-bold tracking-wide">
        <Link to="/" className="hover:text-gray-300 transition-colors">
          MyStore
        </Link>
      </h1>

      {/* Navigation Links */}
      <div className="flex gap-6 items-center">
        {/* Home Link */}
        <Link className="hover:text-gray-300 transition-colors font-medium text-sm" to="/">
          Home
        </Link>

        {/* Wishlist Link with Heart Icon & Red Badge */}
        {user && (
          <Link
            className="hover:text-red-400 transition-colors flex items-center gap-1.5 relative font-medium text-sm"
            to="/wishlist"
            title="Wishlist"
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {wishlistCount}
              </span>
            )}
          </Link>
        )}

        {/* Cart Link with Shopping Bag Icon & Blue Badge */}
        <Link
          className="hover:text-blue-400 transition-colors flex items-center gap-1.5 relative font-medium text-sm"
          to="/cart"
          title="Shopping Cart"
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span>Cart</span>
          <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {cartCount}
          </span>
        </Link>

        {/* Dynamic Auth Section */}
        {!user ? (
          <>
            <Link className="hover:text-gray-300 transition-colors font-medium text-sm" to="/login">
              Login
            </Link>
            <Link
              className="bg-white text-black px-4 py-1.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-all"
              to="/register"
            >
              Register
            </Link>
          </>
        ) : user.role === "admin" ? (
          <>
            <Link className="hover:text-blue-400 transition-colors font-medium text-sm" to="/admin">
              Admin Dashboard
            </Link>
            <Link className="hover:text-red-400 transition-colors font-medium text-sm" to="/logout">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link className="hover:text-gray-300 transition-colors font-medium text-sm" to="/profile">
              Profile ({user.name?.split(" ")[0] || "User"})
            </Link>
            <Link className="hover:text-red-400 transition-colors font-medium text-sm" to="/logout">
              Logout
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;