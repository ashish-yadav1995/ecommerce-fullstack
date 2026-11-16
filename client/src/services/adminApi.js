import api from "./api";

// 1. Dashboard Stats
export const getAdminDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// 2. User Management
export const getAllAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const activateUser = async (id) => {
  const response = await api.patch(`/admin/users/${id}/activate`);
  return response.data;
};

export const deactivateUser = async (id) => {
  const response = await api.patch(`/admin/users/${id}/deactivate`);
  return response.data;
};

// 3. Product Moderation
export const getAllAdminProducts = async () => {
  const response = await api.get("/admin/products");
  return response.data;
};

export const activateProduct = async (id) => {
  const response = await api.patch(`/admin/products/${id}/activate`);
  return response.data;
};

export const deactivateProduct = async (id) => {
  const response = await api.patch(`/admin/products/${id}/deactivate`);
  return response.data;
};

// 4. Orders & Reviews
export const getAdminRecentOrders = async () => {
  const response = await api.get("/admin/orders/recent");
  return response.data;
};


export const getAllAdminReviews = async () => {
  const response = await api.get("/admin/reviews");
  return response.data;
};

export const deleteAdminReview = async (id) => {
  const response = await api.delete(`/admin/reviews/${id}`);
  return response.data;
};