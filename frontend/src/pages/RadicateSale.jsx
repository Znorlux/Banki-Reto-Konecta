import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import SaleFormHeader from "@/components/Sales/SaleFormHeader";
import SaleForm from "@/components/Sales/SaleForm";
import SaleSummary from "@/components/Sales/SaleSummary";

// URL base de la API
const API_URL = "http://localhost:5000/api";

/**
 * Componente para la página de radicación de ventas - Conectado a API real
 */
const RadicateSale = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Manejar envío del formulario
  const handleSubmitSale = async (formData) => {
    try {
      setLoading(true);

      // Transformar el tipo de producto al formato que espera el backend
      let productType;
      switch (formData.product) {
        case "Credito de Consumo":
          productType = "CREDITO_DE_CONSUMO";
          break;
        case "Libranza Libre Inversión":
          productType = "LIBRANZA_LIBRE_INVERSION";
          break;
        case "Tarjeta de Credito":
          productType = "TARJETA_DE_CREDITO";
          break;
        default:
          productType = formData.product;
      }

      // Preparar datos para la API
      const productData = {
        productType,
        requestedQuota: parseInt(formData.requestedQuota.replace(/\D/g, "")), // Convertir a número
        franchise: formData.franchise || undefined, // Solo para tarjetas de crédito
        rate: formData.rate ? parseFloat(formData.rate) : undefined, // Solo para créditos
      };

      console.log("Enviando datos a la API:", productData);

      // Obtener token JWT
      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      // Enviar datos al backend
      const response = await axios.post(`${API_URL}/products`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        toast.success("Venta radicada con éxito", {
          description: "Redirigiendo al dashboard...",
        });

        // Redireccionar al dashboard después de un breve retraso
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Error al radicar venta");
      }
    } catch (error) {
      console.error("Error al radicar venta:", error);

      let errorMessage = "Error al radicar venta. Intente nuevamente.";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;

        // Si hay errores de validación específicos
        if (
          error.response.data.errors &&
          error.response.data.errors.length > 0
        ) {
          errorMessage = error.response.data.errors
            .map((err) => err.msg)
            .join(", ");
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Botón para volver y título */}
      <div className="flex items-start gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full mt-1 cursor-pointer"
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
            currentUser={
              user || {
                id: 0,
                name: "Usuario",
                role: "ASESOR",
              }
            }
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
