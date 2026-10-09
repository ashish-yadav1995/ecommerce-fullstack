import api from "./api";

export const createOrder = async ({ addressId, paymentMethod }) => {
    const response = await api.post("./order", {shippingAddress: addressId, paymentMethod });

    return response.data;
};

export const getMyOrders = async ()=>{
    const response = await api.get("./order/my-orders")

    return response.data;
}


export const getOrderById = async (orderId) => {
    const response = await api.get(`./order/${orderId}`)
    
    return response.data;
}

export const cancelOrder = async (orderId) => {
    const response = await api.patch(`./order/${orderId}/cancel`)

    return response.data;
}