import { Navigate } from "react-router-dom";
import useAuth from "../Hooks/useAuth";
import React from "react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" />;
}
