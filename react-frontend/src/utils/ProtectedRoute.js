import { Navigate } from "react-router-dom";
import { INVALID_TOKEN, TOKEN_KEY, useAuth } from "../context/AuthProvider";

export const ProtectedRoute = ({ children }) => {
  const { value } = useAuth();
  const token = localStorage.getItem(TOKEN_KEY);

  if (!value.token && !token === INVALID_TOKEN) {
    return <Navigate to="/home" replace />;
  }
  return children;
};