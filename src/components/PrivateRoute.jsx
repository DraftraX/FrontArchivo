import React from "react";
import { Navigate } from "react-router-dom";
import { API_URL } from "../../url.js";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
