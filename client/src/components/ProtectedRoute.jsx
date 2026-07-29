import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 'role' prop add kiya hai (optional)
function ProtectedRoute({ children, role, guestOnly }) {
  const { user, loading } = useAuth(); // Agar loading state hai toh use karein
  const location = useLocation();

  if (loading) return <div>Loading...</div>; // Safety check

  
  // 1. Agar user logged in hi nahi hai
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user && guestOnly) {
   return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Agar 'role' manga gaya hai (jaise admin) aur user ka role match nahi karta
  
  if (role && user.role !== role) {
    return <Navigate to="/" replace />; // Role mismatch pe home bhej do
  }


  return children;
}

export default ProtectedRoute;