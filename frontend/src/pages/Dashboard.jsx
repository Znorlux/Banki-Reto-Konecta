import React, { useState, useEffect } from "react";
import { Briefcase, CreditCard, Users, BarChart4 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import WelcomeCard from "@/components/Dashboard/WelcomeCard";
import StatCard from "@/components/Dashboard/StatCard";
import ProductTable from "@/components/Dashboard/ProductTable";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    products: [],
    totalQuota: 0,
    totalProducts: 0,
    activeProducts: 0,
  });

  // Manejar los datos cargados desde ProductList
  const handleProductsLoaded = (data) => {
    const { products, totalQuota } = data;

    setDashboardData({
      products,
      totalQuota,
      totalProducts: products.length,
      // Consideramos como activos los productos que no están finalizados
      activeProducts: products.filter((p) => p.status !== "FINALIZADO").length,
    });
  };

  return (
    <DashboardLayout>
      <WelcomeCard
        userName={user?.name || "Usuario"}
        userRole={user?.role === "ADMINISTRADOR" ? "Administrador" : "Asesor"}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Productos totales"
          value={dashboardData.totalProducts}
          icon={<Briefcase />}
          trend={true}
          trendValue={
            dashboardData.totalProducts > 0
              ? "Datos actualizados"
              : "Sin productos"
          }
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Cupo total"
          value={`$${dashboardData.totalQuota.toLocaleString()}`}
          icon={<CreditCard />}
          trend={true}
          trendValue={
            dashboardData.totalQuota > 0
              ? "Valor actualizado"
              : "Sin cupo registrado"
          }
          bgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          title="Usuarios activos"
          value={
            user?.role === "ADMINISTRADOR"
              ? "Todo el equipo"
              : "Cuenta personal"
          }
          icon={<Users />}
          trend={false}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatCard
          title="Productos activos"
          value={dashboardData.activeProducts}
          icon={<BarChart4 />}
          trend={true}
          trendValue={`${
            dashboardData.activeProducts > 0
              ? Math.round(
                  (dashboardData.activeProducts / dashboardData.totalProducts) *
                    100
                )
              : 0
          }% del total`}
          bgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Lista de productos conectada a la API real */}
      <ProductTable onProductsLoaded={handleProductsLoaded} />
    </DashboardLayout>
  );
};

export default Dashboard;
