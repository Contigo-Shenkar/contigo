import React from "react";
import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const isTokenValid = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = token && isTokenValid(token);

  if (isAuthenticated) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
