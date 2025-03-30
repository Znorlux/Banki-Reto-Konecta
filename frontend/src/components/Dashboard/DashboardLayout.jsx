import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

// Componente de layout para el dashboard
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Verificar autenticación
  const isAuthenticated = localStorage.getItem("userToken");
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Obtener rol del usuario
  const userRole = localStorage.getItem("userRole") || "Administrador";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        userRole={userRole}
        onClose={closeSidebar}
      />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
