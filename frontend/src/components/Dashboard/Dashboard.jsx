import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, CreditCard, Users, BarChart4 } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "./DashboardLayout";
import WelcomeCard from "./WelcomeCard";
import StatCard from "./StatCard";
import ProductTable from "./ProductTable";

// Componente principal del dashboard
const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([
    {
      id: 1,
      product: "Credito de Consumo",
      requestedQuota: 1000000,
      creationDate: "2024-03-27",
      user: "Juan Pérez",
      createdBy: "Admin",
    },
    {
      id: 2,
      product: "Tarjeta de Credito",
      requestedQuota: 5000000,
      creationDate: "2024-03-26",
      user: "María González",
      createdBy: "Admin",
    },
    {
      id: 3,
      product: "Libranza Libre Inversión",
      requestedQuota: 8000000,
      creationDate: "2024-03-25",
      user: "Carlos Rodríguez",
      createdBy: "Asesor1",
    },
  ]);

  // Datos del usuario
  const userName = localStorage.getItem("userName") || "Admin User";
  const userRole = localStorage.getItem("userRole") || "Administrador";

  // Filtrar productos según el rol del usuario
  const filteredProducts =
    userRole === "Administrador"
      ? products
      : products.filter((product) => product.createdBy === "Asesor1");

  // Calcular suma total de cuotas
  const totalQuota = filteredProducts.reduce(
    (sum, product) =>
      sum +
      (typeof product.requestedQuota === "number"
        ? product.requestedQuota
        : parseInt(product.requestedQuota.replace(/,/g, ""), 10)),
    0
  );

  // Manejadores de eventos para la tabla
  const handleAddProduct = () => {
    navigate("/sales/new");
  };

  const handleViewProduct = (id) => {
    // Usando Sonner en lugar de toast de shadcn
    toast.info("Ver producto", {
      description: `Visualizando el producto con ID: ${id}`,
    });
  };

  const handleEditProduct = (id) => {
    navigate(`/ventas/editar/${id}`);
  };

  const handleDeleteProduct = (id) => {
    // Usando Sonner en lugar de toast de shadcn
    toast.error("Producto eliminado", {
      description: `Se ha eliminado el producto con ID: ${id}`,
    });

    // En una aplicación real, aquí harías una llamada a la API
    // Por ahora, simplemente actualizamos el estado local
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <DashboardLayout>
      <WelcomeCard userName={userName} userRole={userRole} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Productos totales"
          value={filteredProducts.length}
          icon={<Briefcase />}
          trend={true}
          trendValue="Aumentó un 8% este mes"
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Cuota total"
          value={`$${totalQuota.toLocaleString()}`}
          icon={<CreditCard />}
          trend={true}
          trendValue="Aumentó un 12% este mes"
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          title="Usuarios totales"
          value={userRole === "Administrador" ? "12" : "1"}
          icon={<Users />}
          trend={true}
          trendValue="Aumentó un 5% este mes"
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatCard
          title="Productos activos"
          value={filteredProducts.length}
          icon={<BarChart4 />}
          trend={true}
          trendValue="100% de productos activos"
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      <ProductTable
        products={filteredProducts}
        onAdd={handleAddProduct}
        onView={handleViewProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
