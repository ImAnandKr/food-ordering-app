import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ adminOnly = false }) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // 1. Check if user is logged in
  if (!userInfo) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // 2. Check if admin access is required
  if (adminOnly && userInfo.role !== 'admin') {
    // Logged in but not an admin, redirect to home
    return <Navigate to="/" replace />;
  }

  // 3. User is authorized, render the child component
  return <Outlet />;
};

export default PrivateRoute;