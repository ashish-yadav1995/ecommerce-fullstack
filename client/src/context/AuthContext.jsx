import { createContext, useCallback, useContext, useEffect, useState } from "react";

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

  const fetchAddresses = useCallback(
    async () => {
      try {
        const response = await getAddresses();
        console.log("Fetched addresses:", response.data);
        setAddresses(response.data);
      } catch (error) {
        alert(error.message || "Failed to fetch addresses");
      }
    }, []);

  const handleAddNewAddress = async (addressData) => {
    try {
      await addAddress(addressData); // Server par add kiya
      await fetchAddresses();        // Phir se list fetch karke state update ki
    } catch (error) {
      console.error("Failed to add address", error);
    }
  };

  const handleUpdateAddress = async (id, addressData) => {
    try {
      const UpdatedAddress = await updateAddress(id, addressData)
      await fetchAddresses()

      // const updatedAddress = addresses.map((item)=>{
      //        return item._id === updateAddress._id ? updateAddress : item
      // })

      // setAddresses(UpdatedAddress)
    } catch (error) {
      console.error("Failed to update address", error);
    }
  }

  const handleDeleteAddress = async (id) => {
    try {
      const response = await cancelAddress(id);
      await fetchAddresses();

    } catch (error) {
      console.error("Failed to delete address", error);

    }
  }

  const handleSetDefaultAddress = async (id) => {
    try {
      const response = await setDefaultAddress(id);
      await fetchAddresses();
    } catch (error) {
      console.error("Failed to setDefault address", error);
    }
  }


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser();
        const loggedInUser = response.data;
        setUser(loggedInUser);
      } catch (error) {
        console.error("Fetch User Error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAddresses(); // Jab bhi user milega, yeh khud apne aap chal jayega
    } else {
      setAddresses([]); // Logout hone par list khali ho jayegi
    }
  }, [user, fetchAddresses]);

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
        handleAddNewAddress,
        login,
        logout,
        isAuthenticated: Boolean(user),
        updateUser,
        handleUpdateAddress,
        handleDeleteAddress,
        handleSetDefaultAddress
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
