import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminRoute: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.roles.includes('ROLE_ADMIN');
  
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" />;
};
