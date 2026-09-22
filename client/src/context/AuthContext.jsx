// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// function AuthProvider({ children }) {
//   const [user, setUser] = useState(()=>{
//     const savedUser = localStorage.getItem("login_user")
//     return savedUser ? JSON.parse(savedUser) : null;
//   });

//   const Login = (rgisteredUser,username, password,role) => {
//     // if (username === "admin" && password == "pass123") {
//     //   setUser({ name: "Admin", role: "admin" });}
//     //   if (role === "admin" ) {
//     //   setUser({ name: "Admin", role: "admin" });
//     // } else {
//     //   setUser({ name: username, role: "user" });
//     // }
//     setUser(rgisteredUser)
//   };

//   const Logout = () => {
//     // localStorage.removeItem("login_user")
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, Login, Logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export default AuthProvider;

// =============================================

import { createContext, useContext, useEffect, useState } from "react";

import { loginUser, getCurrentUser, logoutUser } from "../services/authApi";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Page refresh hone par cookie se user restore karega
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getCurrentUser();

        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login
  const Login = async (email, password) => {
    setLoading(true);

    try {
      const response = await loginUser(email, password);

      setUser(response.data);

      return response;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const Logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        Login,
        Logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
