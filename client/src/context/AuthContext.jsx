import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(()=>{
    const savedUser = localStorage.getItem("login_user")
    return savedUser ? JSON.parse(savedUser) : null;
  });


  useEffect(()=>{
    localStorage.setItem("login_user",JSON.stringify(user))
  },[user])

  const Login = (rgisteredUser,username, password,role) => {
    // if (username === "admin" && password == "pass123") {
    //   setUser({ name: "Admin", role: "admin" });}
    //   if (role === "admin" ) {
    //   setUser({ name: "Admin", role: "admin" });
    // } else {
    //   setUser({ name: username, role: "user" });
    // }
    setUser(rgisteredUser)
  };

  const Logout = () => {
    // localStorage.removeItem("login_user")
    setUser(null);        
  };

  return (
    <AuthContext.Provider value={{ user, setUser, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
