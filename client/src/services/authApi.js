import api from "./api";

// Login
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

// Current logged-in user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// Logout
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

// Customer Register
export const registerUser = async (name, email, password) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return response.data;
};

// Seller Register
export const registerSeller = async (name, email, password) => {
  const response = await api.post("/auth/register-seller", {
    name,
    email,
    password,
  });

  return response.data;
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  const response = await api.post("/auth/verify-otp", {
    email,
    otp,
  });

  return response.data;
};

// Resend OTP
export const resendOTP = async (email) => {
  const response = await api.post("/auth/resend-otp", {
    email,
  });

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    email,
    otp,
    newPassword,
  });

  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await api.post("/address", addressData);

  return response.data;
};

export const getAddresses = async () => {
  const response = await api.get("/address");

  return response.data;
};
export const updateAddress = async (id, addressData) => {
  const response = await api.put(`/address/${id}`, addressData);

  return response.data;
};
export const cancelAddress = async (id) => {
  const response = await api.delete(`/address/${id}`);

  return response.data;
};

export const setDefaultAddress = async (id) => {
  const response = await api.patch(`/address/default${id}`);

  return response.data;
};
