import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Array} props.allowedRoles - Roles permitidos para acceder a la ruta, podriamos poner más roles
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading, initialized } = useAuth();

  // Mientras verificamos la autenticación, mostramos un loader
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles específicos permitidos y el usuario no tiene un rol permitido
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirigir al dashboard por falta de permisos
    return <Navigate to="/dashboard" replace />;
  }

  // Si está autenticado y tiene los permisos (o no se requieren roles específicos)
  return <Outlet />;
};

export default ProtectedRoute;
