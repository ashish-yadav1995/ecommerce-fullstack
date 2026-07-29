import { createContext, useContext, useEffect, useState } from "react";
const CartContext = createContext();
export const useCart = () => useContext(CartContext); // export karna bhul gaya tha

function CartProvider({ children }) {
  // const [cart, setCart] = useState([]);
  const [cart, setCart] = useState(() => {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : [];
});

  useEffect(()=>{
   localStorage.setItem("cart", JSON.stringify(cart))
  },[cart])

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = cart.find((item) => item.id === product.id);

      if (exist) {
        return prev.map((item) => {
          return item.id === product.id
            // ? { ...item, quantity:item.quantity < 1 ? item.quantity + 1: 1 }
             ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQty = (id) => {
    setCart((prev) => {
      return prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  };

  const decreaseQty = (id) => {
    setCart((prev) => {
      return prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((newItem) => {
          return newItem.quantity > 0;
        });
    });
  };

  const clearCart = ()=>{
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increaseQty, decreaseQty, clearCart}}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
