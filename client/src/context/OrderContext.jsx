import { createContext, useContext, useState, useEffect } from "react";
const OrderContext = createContext();
export const useOrder = () => useContext(OrderContext);
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../services/orderApi";

function OrderProvider({ children }) {
  const placeOrder = async (addressId, paymentMethod) => {
    try {
      const response = await createOrder({ addressId, paymentMethod });
      return response.data;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;
