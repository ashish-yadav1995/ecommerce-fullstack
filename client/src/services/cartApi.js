import api from "./api";


export const addToCart = async (productId, { quantity }) => {
  const response = await api.post("/cart", { productId, quantity });

  return response.data;
};

// export const getCartItems = async () => {
export const getCart = async () => {
  const response = await api.get("/cart");

  return response.data;
};

// export const updateCartItems = async (productId, { quantity }) => {
  export const updateCart = async (productId, quantity ) => {
  console.log("productId", productId, "quantity", quantity);
  const response = await api.put(`/cart/${productId}`, { quantity });

  return response.data;
};

// export const deleteCartItem = async (productId)=>{
export const removeCartItem = async (productId)=>{
  console.log("productId", productId)
const response = await api.delete(`/cart/${productId}`);

  return response.data;
} 

// export const deleteAllCartItems = async ()=>{
export const clearCart = async ()=>{
const response = await api.delete("/cart");

  return response.data;
} 

