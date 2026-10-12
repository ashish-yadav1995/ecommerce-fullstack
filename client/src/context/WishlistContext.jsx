// import { createContext, useContext, useEffect, useState } from "react";
// import { useCart } from "./CartContext";
// import {
//   addToWishlist,
//   getWishlist,
//   removeToWishlist,
//   clearWishlist,
// } from "../services/wishlistApi";

// const WishListContext = createContext();
// export const useWishList = () => useContext(WishListContext);

// function WishListProvider({ children }) {
//   const [Wishlist, setWishlist] = useState([]);

//   const { cart, removeFromCart } = useCart();

//   useEffect(() => {

//   }, [Wishlist]);

//   const handleAddToWishlist = async (product) => {
//     try {
//       const response = await addToWishlist(product);
//       return response.data

//     } catch (error) {
//         alert(error.response?.data?.message || "Failed to add in Wishlist");
//     }

//   };

//   const handleGetWishlist = async() => {
//     try {
//       const response = await getWishlist();
//       return response.data

//     } catch (error) {
//         alert(error.response?.data?.message || "Failed to get your favourite");
//     }
//   };

//   const handleRemoveToWishlist = async (id) => {
//   try {
//       const response = await removeToWishlist(id);
//       return response.data

//     } catch (error) {
//         alert(error.response?.data?.message || "Failed to Delete Your product");
//     }
//   };

//   const handleClearWishlist = async() => {
//   try {
//       const response = await clearWishlist();
//       return response.data

//     } catch (error) {
//         alert(error.response?.data?.message || "Failed to Clear favourite");
//     }
//   };

//   return (
//     <WishListContext.Provider
//       value={{
//         Wishlist,
//         handleAddToWishlist,
//         handleGetWishlist,
//         handleRemoveToWishlist,
//         handleClearWishlist,
//       }}
//     >
//       {children}
//     </WishListContext.Provider>
//   );
// }

// export default WishListProvider;

// ==========================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getWishlist,
  addToWishlist as addToWishlistAPI,
  removeToWishlist,
  clearWishlist as clearWishlistAPI,
} from "../services/wishlistApi";

import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Wishlist fetch
  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      return [];
    }

    setLoading(true);
    setError("");

    try {
      const response = await getWishlist();
      const items = response?.data;

      if (!Array.isArray(items)) {
        throw new Error("Invalid wishlist response from server");
      }

      setWishlistItems(items);
      return items;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch wishlist",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch after authentication is ready
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setWishlistItems([]);
      setError("");
      setLoading(false);
      return;
    }

    fetchWishlist().catch(() => {});
  }, [user, authLoading, fetchWishlist]);

  // Add product
  const addItem = useCallback(
    async (productId) => {
      if (!user) {
        throw new Error("Please login to use wishlist");
      }

      if (!productId) {
        throw new Error("Product ID is required");
      }

      const alreadyExists = wishlistItems.some(
        (item) =>
          String(item.product?._id || item.product) === String(productId),
      );

      if (alreadyExists) return false;

      setError("");

      try {
        await addToWishlistAPI(productId);
        await fetchWishlist();
        return true;
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Failed to add product",
        );
        throw err;
      }
    },
    [user, wishlistItems, fetchWishlist],
  );

  // Remove using Wishlist document ID
  const removeItem = useCallback(async (wishlistItemId) => {
    if (!wishlistItemId) {
      throw new Error("Wishlist item ID is required");
    }

    setError("");

    try {
      await removeToWishlist(wishlistItemId);

      setWishlistItems((previous) =>
        previous.filter((item) => String(item._id) !== String(wishlistItemId)),
      );

      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to remove wishlist item",
      );
      throw err;
    }
  }, []);

  // Clear all
  const clearAll = useCallback(async () => {
    setError("");

    try {
      await clearWishlistAPI();
      setWishlistItems([]);
      return true;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to clear wishlist",
      );
      throw err;
    }
  }, []);

  // Check product ID
  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;

      return wishlistItems.some(
        (item) =>
          String(item.product?._id || item.product) === String(productId),
      );
    },
    [wishlistItems],
  );

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    error,
    fetchWishlist,
    addItem,
    removeItem,
    clearAll,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return context;
}

export default WishlistContext;

// ======================================

// wishlist.jsx me aayega  Add/remove toggle ke liye:
const handleWishlist = async () => {
  try {
    if (saved) {
      const item = wishlistItems.find(
        (entry) =>
          String(entry.product?._id || entry.product) ===
          String(product._id)
      );

      if (item) await removeItem(item._id);
    } else {
      await addItem(product._id);
    }
  } catch (error) {
    console.error(error);
  }
};
