import api from "./api";

export const addReviews = async (data) => {
    const response = await api.post("/reviews", data)

    return response.data;
}

export const getSingleProductReviews = async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`)

    return response.data;
}

export const updateReviews = async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data)

    return response.data;
}


export const deleteReviews = async (id) => {
    const response = await api.delete(`/reviews/${id}`)

    return response.data;
}

