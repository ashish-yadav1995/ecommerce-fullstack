import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
const CartContext = createContext();
export const useCart = () => useContext(CartContext); // export karna bhul gaya tha
import {
  addToCart,
  getCart,
  updateCart,
  removeCartItem,
  clearCart,
} from "../services/cartApi";

function CartProvider({ children }) {

  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);
  const [grandTotal, setGrandTotal] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [getTotalItems, setGetTotalItems] = useState(0);


  const handleAddToCart = async (product) => {
    try {
      const response = await addToCart(product._id, { quantity: 1 });
      alert(response.message || "Product added to cart successfully!");
      if (response.success) {
        fetchCart(); // Fetch the updated cart after adding an item
      }
    } catch (error) {
      alert("Failed to add product to cart. Please try again.");
    }
  };

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getCart();

      setCart(response.data || []);
      setGrandTotal(response.grandTotal || 0);
      setGetTotalItems(response.totalItems || 0);
    } catch (error) {
      console.error("Failed to fetch cart:", error);

      if (error.response?.status === 401) {
        navigate("/login");
        return;
      }

      alert(error.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ==========================================
  // INCREASE / DECREASE QUANTITY
  // ==========================================

  const handleQuantityChange = async (e,productId, change) => {
   e.stopPropagation() // Stop event propagation to prevent navigation
    try {
      setActionLoading(true);

      const response = await updateCart(productId, { quantity: change });

      if (response.cart) {
        const updatedItems = response.cart.map((item) => {
          const product = item.product;

          return {
            ...item,
            subtotal: (product?.price || 0) * item.quantity,
          };
        });

        setCart(updatedItems);

        const total = updatedItems.reduce(
          (sum, item) => sum + item.subtotal,
          0,
        );

        setGrandTotal(total);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update cart");
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const handleRemoveItem = async (productId) => {
    try {
      setActionLoading(true);

      const response = await removeCartItem(productId);
      if (response.cart) {
        const updatedItems = response.cart.map((item) => {
          const product = item.product;

          return {
            ...item,
            subtotal: (product?.price || 0) * item.quantity,
          };
        });

        setCart(updatedItems);

        const total = updatedItems.reduce(
          (sum, item) => sum + item.subtotal,
          0,
        );
        setGrandTotal(total);
        setGetTotalItems(response.cart.length || 0);
        return response
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to remove item");
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const handleClearCart = async () => {
    if (cart.length === 0) {
      return;
    }

    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?",
    );

    if (!confirmClear) {
      return;
    }

    try {
      setActionLoading(true);

      await clearCart();

      setCart([]);
      setGrandTotal(0);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to clear cart");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        handleAddToCart,
        fetchCart,
        loading,
        handleQuantityChange,
        handleRemoveItem,
        handleClearCart,
        grandTotal,
        actionLoading,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
