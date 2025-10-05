// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Services/AuthContext"; // ✅ corrected path
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useContext(AuthContext);

  if (!auth || !auth.token) {
    return <Navigate to="/" replace />; // Redirect to login
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    toast.error("Access Denied - You don’t have permission.");
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
