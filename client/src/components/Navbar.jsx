import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
// import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user } = useAuth();
  // const { wishlistItems } = useWishlist();

  const cartCount =
    typeof getTotalItems === "function" ? getTotalItems() : getTotalItems || 0;
  // const wishlistCount = wishlistItems?.length || 0;
  const wishlistCount = 0;

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-black text-white shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
        {/* Brand Logo */}
        <h1 className="text-xl font-bold tracking-wide">
          <Link
            to="/"
            onClick={closeMenu}
            className="hover:text-gray-300 transition-colors"
          >
            MyStore
          </Link>
        </h1>

        {/* ================= DESKTOP NAVIGATION (md and above) ================= */}
        <div className="hidden md:flex gap-6 items-center">
          <Link
            className="hover:text-gray-300 transition-colors font-medium text-sm"
            to="/"
          >
            Home
          </Link>

          {user?.role !== "admin" && (
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

          {user?.role !== "admin" && (
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
          )}

          {!user ? (
            <>
              <Link
                className="hover:text-gray-300 transition-colors font-medium text-sm"
                to="/login"
              >
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
              <Link
                className="hover:text-blue-400 transition-colors font-medium text-sm"
                to="/admin"
              >
                Admin Dashboard
              </Link>
              <Link
                className="hover:text-red-400 transition-colors font-medium text-sm"
                to="/logout"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              {user.role === "seller" && (
                <Link
                  className="hover:text-yellow-400 transition-colors font-medium text-sm"
                  to="/seller"
                >
                  Seller Panel
                </Link>
              )}
              <Link
                className="hover:text-gray-300 transition-colors font-medium text-sm"
                to="/profile"
              >
                Profile ({user.name?.split(" ")[0] || "User"})
              </Link>
              <Link
                className="hover:text-red-400 transition-colors font-medium text-sm"
                to="/logout"
              >
                Logout
              </Link>
            </>
          )}
        </div>

        {/* ================= MOBILE RIGHT CONTROLS (< md) ================= */}
        <div className="flex md:hidden items-center gap-4">
          {/* Quick Cart Icon on Mobile */}
          {user?.role !== "admin" && (
            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative flex items-center text-white hover:text-blue-400"
            >
              <svg
                className="w-6 h-6"
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
              <span className="ml-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            </Link>
          )}

          {/* Hamburger / Close Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-200 hover:text-white focus:outline-none p-1"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ================= MOBILE DROPDOWN MENU ================= */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-4 pt-3 pb-5 flex flex-col gap-3.5 text-sm font-medium">
          <Link
            to="/"
            onClick={closeMenu}
            className="py-1.5 hover:text-gray-300 border-b border-zinc-800"
          >
            Home
          </Link>

          {user?.role !== "admin" && (
            <Link
              to="/wishlist"
              onClick={closeMenu}
              className="py-1.5 flex items-center justify-between hover:text-red-400 border-b border-zinc-800"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {!user ? (
            <div className="flex flex-col gap-2.5 pt-1">
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full text-center py-2 border border-zinc-700 rounded-lg hover:bg-zinc-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="w-full text-center py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200"
              >
                Register
              </Link>
            </div>
          ) : user.role === "admin" ? (
            <>
              <Link
                to="/admin"
                onClick={closeMenu}
                className="py-1.5 text-blue-400 border-b border-zinc-800"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/logout"
                onClick={closeMenu}
                className="py-1.5 text-red-400"
              >
                Logout
              </Link>
            </>
          ) : (
            <>
              {user.role === "seller" && (
                <Link
                  to="/seller"
                  onClick={closeMenu}
                  className="py-1.5 text-yellow-400 border-b border-zinc-800"
                >
                  Seller Panel
                </Link>
              )}
              <Link
                to="/profile"
                onClick={closeMenu}
                className="py-1.5 hover:text-gray-300 border-b border-zinc-800"
              >
                Profile ({user.name?.split(" ")[0] || "User"})
              </Link>
              <Link
                to="/logout"
                onClick={closeMenu}
                className="py-1.5 text-red-400"
              >
                Logout
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;