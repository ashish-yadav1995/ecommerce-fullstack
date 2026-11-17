import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishList } from "../context/WishlistContext";

function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    fetchCart,
    loading,
    handleQuantityChange,
    handleRemoveItem,
    handleClearCart,
    grandTotal,
    actionLoading,
  } = useCart();
  const { addItem } = useWishList();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleMoveToWishlist = async (e, productId) => {
    e.stopPropagation();
    const response = await handleRemoveItem(productId);
    if (response?.success) {
      await addItem(productId);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-base sm:text-lg font-medium text-gray-600">
          Loading cart...
        </p>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 sm:py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 sm:p-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Your Cart
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Your cart is empty.
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white text-sm sm:text-base font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition"
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
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Cart
          </h1>
          <button
            onClick={handleClearCart}
            disabled={actionLoading}
            className="bg-red-600 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
          >
            {actionLoading ? "Please wait..." : "Clear Cart"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const product = item.product;
              if (!product) return null;

              const image =
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "https://via.placeholder.com/150";

              const hasDiscount =
                product.discountPrice > 0 &&
                product.price > product.discountPrice;
              const effectivePrice = hasDiscount
                ? product.discountPrice
                : product.price;
              const subtotal = effectivePrice * item.quantity;

              return (
                <div
                  key={item._id || product._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* IMAGE */}
                    <Link
                      to="/productdetail"
                      state={{ id: product._id }}
                      className="w-full sm:w-32 h-44 sm:h-32 bg-gray-50 rounded-lg p-2 flex-shrink-0 flex items-center justify-center"
                    >
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </Link>

                    {/* PRODUCT INFO */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                          <Link
                            to="/productdetail"
                            state={{ id: product._id }}
                            className="text-base sm:text-xl font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 transition"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                            {product.brand}
                          </p>
                        </div>

                        {/* ACTIONS BLOCK */}
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <button
                            onClick={() => handleRemoveItem(product._id)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium transition-colors"
                          >
                            Remove
                          </button>

                          <button
                            onClick={(e) => handleMoveToWishlist(e, product._id)}
                            disabled={actionLoading}
                            className="text-gray-500 hover:text-blue-600 text-[11px] sm:text-xs underline transition-colors whitespace-nowrap"
                          >
                            Move to Wishlist
                          </button>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="mt-2.5">
                        {hasDiscount ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-base sm:text-lg font-bold text-green-600">
                              ₹{product.discountPrice}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-400 line-through">
                              ₹{product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-base sm:text-lg font-bold text-gray-900">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      {/* QUANTITY & SUBTOTAL */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={(e) =>
                              handleQuantityChange(e, product._id, -1)
                            }
                            disabled={actionLoading || item.quantity <= 1}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-lg hover:bg-gray-100 disabled:opacity-40 transition"
                          >
                            −
                          </button>

                          <span className="px-3.5 sm:px-5 py-1.5 sm:py-2 border-x border-gray-200 text-sm sm:text-base font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={(e) =>
                              handleQuantityChange(e, product._id, 1)
                            }
                            disabled={
                              actionLoading || item.quantity >= product.stock
                            }
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-lg hover:bg-gray-100 disabled:opacity-40 transition"
                          >
                            +
                          </button>
                        </div>

                        {/* SUBTOTAL */}
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Subtotal</p>
                          <p className="text-lg sm:text-xl font-bold text-gray-900">
                            ₹{subtotal}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 lg:sticky lg:top-20">
              <h2 className="text-xl sm:text-2xl font-bold mb-5 text-gray-900">
                Order Summary
              </h2>

              <div className="flex justify-between text-sm sm:text-base mb-3">
                <span className="text-gray-600">Items</span>
                <span className="font-medium">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{grandTotal}</span>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                disabled={cart.length === 0}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-700 disabled:opacity-50 transition shadow-sm"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/"
                className="block text-center mt-4 text-sm text-blue-600 hover:underline"
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