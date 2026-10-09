import api from "./api";

// Create Product
export const createProduct = async (formData) => {
  const response = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getAllProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Get Seller's Products
export const getMyProducts = async () => {
  const response = await api.get("/products/my-products");

  return response.data;
};

export const updateProduct = async (id, form) => {
  console.log("form", form);
  const response = await api.put(`/products/${id}`, form);

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`products/${id}`);

  return response.data;
}; 