import { createContext, useContext, useCallback, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../services/orderApi";

function OrderProvider({ children }) {
  const [orders, setOrders] = useState(null);
  const { user } = useAuth();

  const placeOrder = async (addressId, paymentMethod) => {
    try {
      const response = await createOrder({ addressId, paymentMethod });
      if (response.success) {
        setOrders((prevOrders) => [response.order, ...prevOrders]);  
      }
      return response.order;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  };

  const handleGetMyOrders = useCallback(
    async () => {
      try {
        const myorders = await getMyOrders();
        setOrders(myorders.data || []);
      } catch (error) {
        console.log("your orders unable to fetched successfully", error);
        setOrders([]);
      }
    }, []
  );

  useEffect(() => {
    //  Agar user logged-in hai, tabhi orders fetch karo
    if (user) {
      handleGetMyOrders();
    } else {
      setOrders([]); // Logout hone par orders ko khali kar do
    }
  }, [handleGetMyOrders, user]); //  Yaha user ko dependency aayega jab user change hoga, tabhi orders fetch honge

  console.log("orders from context", orders)

  const handleGetOrderById = useCallback(async (orderId) => {
    // Yahan try-catch ki zaroorat nahi hai agar error ko component me handle kar rahe hain
    const response = await getOrderById(orderId);
    return response;
  }, []);

  return (
    <OrderContext.Provider value={{ placeOrder, orders, setOrders, handleGetMyOrders, handleGetOrderById }}>
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;
