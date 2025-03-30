import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import SaleFormHeader from "@/components/Sales/SaleFormHeader";
import SaleForm from "@/components/Sales/SaleForm";
import SaleSummary from "@/components/Sales/SaleSummary";

/**
 * Componente para la página de radicación de ventas
 */
const RadicateSale = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Obtener información del usuario actual desde localStorage
  const currentUser = {
    id: 1, // En un escenario real, esto vendría del token JWT decodificado
    name: localStorage.getItem("userName") || "Usuario",
    role: localStorage.getItem("userRole") || "Asesor",
  };

  // Manejar envío del formulario
  const handleSubmitSale = (formData) => {
    setLoading(true);

    // Simular llamada a API con un retraso
    setTimeout(() => {
      // Preparar datos para enviar al backend
      const now = new Date().toISOString().replace("T", " ").substring(0, 19);
      const saleData = {
        ...formData,
        id: Math.floor(Math.random() * 10000) + 1, // Simulación de ID autoincrementable
        creationDate: now,
        updateDate: now,
        createdBy: currentUser.id,
        updatedBy: currentUser.id,
      };

      // Lógica para guardar en el backend (simulado)
      console.log("Datos de venta a enviar:", saleData);

      // Mostrar mensaje de éxito
      toast.success("Venta radicada con éxito", {
        description: "Redirigiendo al dashboard...",
      });

      // Redireccionar al dashboard después de un breve retraso
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

      setLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout>
      {/* Botón para volver y título */}
      <div className="flex items-start gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full mt-1"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">Radicar Venta</h1>
          <p className="text-gray-500 mt-1">
            Completa el formulario para registrar un nuevo producto financiero
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario principal */}
        <div className="lg:col-span-2">
          {/* Encabezado del formulario */}
          <SaleFormHeader
            icon={<FileCheck className="h-5 w-5" />}
            title="Información del Producto"
            description="Ingresa los detalles del producto financiero a radicar"
          />

          {/* Formulario de radicación */}
          <SaleForm
            onSubmit={handleSubmitSale}
            loading={loading}
            currentUser={currentUser}
          />
        </div>

        {/* Panel lateral con información adicional */}
        <div>
          <SaleSummary />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RadicateSale;
