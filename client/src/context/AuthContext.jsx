import { createContext, useContext, useEffect, useState } from "react";

import {
  loginUser,
  logoutUser,
  getCurrentUser,
  addAddress,
  getAddresses,
  updateAddress,
  cancelAddress,
  setDefaultAddress,
} from "../services/authApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);

  // Login
  const login = async (data) => {
    const response = await loginUser(data.email, data.password);
    const loggedInUser = response.data;
    setUser(loggedInUser);
    return loggedInUser;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // Cookie clear karne ke liye
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await getAddresses();
      console.log("Fetched addresses:", response.data);
      setAddresses(response.data);
    } catch (error) {
      alert(error.message || "Failed to fetch addresses");
    }
  };

  const addNewAddress = async (addressData) => {
    const response = await addAddress(addressData);
    return response.data;
  };

  // useEffect(async () => {
  //   // fetchAddresses();
  //   try {
  //     const response = await getCurrentUser();
  //     console.log(response.data);
  //     const loggedInUser = response.data;
  //     setUser(loggedInUser);
  //   } catch (error) {
  //     setUser(null);
  //     alert(errorData?.message || "Invalid email or password.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        const loggedInUser = response.data;
        setUser(loggedInUser);
      } catch (error) {
        console.error("Fetch User Error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // User Profile update hone par state refresh karne ke liye
  const updateUser = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
        addresses,
        setAddresses,
        fetchAddresses,
        addNewAddress,
        login,
        logout,
        isAuthenticated: Boolean(user),
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
