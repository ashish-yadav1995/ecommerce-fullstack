import { createContext, useContext, useCallback, useState, useEffect } from "react";
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

  const placeOrder = async (addressId, paymentMethod) => {
    try {
      const response = await createOrder({ addressId, paymentMethod });
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
        console.log("orders from orders context", myorders);
        setOrders(myorders.data);
      } catch (error) {
        console.log("your orders unable to fetched successfully", error);
      }
    }, []);// <-- Dependency array empty rahega

  useEffect(() => {
    handleGetMyOrders();
  }, [handleGetMyOrders]); // <-- Yahan 'orders' nahi hona chahiye!

const handleGetOrderById = useCallback(async (orderId) => {
  // Yahan try-catch ki zaroorat nahi hai agar error ko component me handle kar rahe hain
  const response = await getOrderById(orderId);
  return response;
}, []);

  return (
    <OrderContext.Provider value={{ placeOrder, orders, handleGetMyOrders, handleGetOrderById }}>
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;
