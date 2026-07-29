import { createContext, useContext, useEffect, useState } from "react";
import { useCart } from "./CartContext";

const WishListContext = createContext();
export const useWishList = () => useContext(WishListContext);

function WishListProvider({ children }) {
  const [Wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("savedwishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const { cart, removeFromCart } = useCart();

  useEffect(() => {
    localStorage.setItem("savedwishlist", JSON.stringify(Wishlist));
  }, [Wishlist]);

  const addToWishlist = (product) => {
    console.log("added to wishlist");
    setWishlist((prev) => {
      const isExist = prev.find((item) => item.id === product.id);
      if (isExist) return prev;
      return [...prev, product];
    });
    removeFromCart(product.id);
  };
  console.log("wishlist", Wishlist);
  const removeFromWishlist = (id) => {
    console.log("remove from wishlist");
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <WishListContext.Provider
      value={{ Wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishListContext.Provider>
  );
}

export default WishListProvider;
