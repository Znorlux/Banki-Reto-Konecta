import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  User,
  Tag,
  Clock,
  PercentIcon,
  Loader2,
} from "lucide-react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const API_URL = "http://localhost:5000/api";

/**
 * Modal para mostrar los detalles de un producto
 */
const ProductDetailModal = ({ productId, open, onOpenChange }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar los detalles del producto cuando se abre el modal
  useEffect(() => {
    if (open && productId) {
      fetchProductDetails();
    }
  }, [open, productId]);

  // Función para obtener los detalles del producto
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.get(`${API_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProduct(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Error al cargar detalles del producto"
        );
      }
    } catch (error) {
      console.error("Error al cargar detalles del producto:", error);
      setError(
        "No se pudieron cargar los detalles del producto. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear el tipo de producto
  const formatProductType = (type) => {
    switch (type) {
      case "CREDITO_DE_CONSUMO":
        return "Crédito de Consumo";
      case "LIBRANZA_LIBRE_INVERSION":
        return "Libranza Libre Inversión";
      case "TARJETA_DE_CREDITO":
        return "Tarjeta de Crédito";
      default:
        return type;
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Función para mostrar el badge de estado
  const getStatusBadge = (status) => {
    switch (status) {
      case "ABIERTO":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Abierto
          </Badge>
        );
      case "EN_PROCESO":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            En Proceso
          </Badge>
        );
      case "FINALIZADO":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Finalizado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalles del Producto</DialogTitle>
          <DialogDescription>
            Información completa del producto financiero
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando detalles...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchProductDetails} variant="outline">
              Reintentar
            </Button>
          </div>
        ) : product ? (
          <div className="space-y-4">
            {/* Información principal */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-800 text-lg">
                  {formatProductType(product.productType)}
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Valor:</span>
                <span className="font-semibold text-green-600">
                  ${product.requestedQuota.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-600">Estado:</span>
                {getStatusBadge(product.status)}
              </div>
            </div>

            <Separator />

            {/* Información específica según tipo de producto */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">
                Características Específicas
              </h4>

              {product.productType === "TARJETA_DE_CREDITO" &&
                product.franchise && (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="text-gray-600 mr-2">Franquicia:</span>
                    <span className="font-medium">{product.franchise}</span>
                  </div>
                )}

              {["CREDITO_DE_CONSUMO", "LIBRANZA_LIBRE_INVERSION"].includes(
                product.productType
              ) &&
                product.rate !== null && (
                  <div className="flex items-center">
                    <PercentIcon className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="text-gray-600 mr-2">Tasa:</span>
                    <span className="font-medium">{product.rate}%</span>
                  </div>
                )}
            </div>

            <Separator />

            {/* Información de seguimiento */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">
                Información de Seguimiento
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-gray-600 mr-2">Creación:</span>
                  <span className="text-sm">
                    {formatDate(product.createdAt)}
                  </span>
                </div>

                <div className="flex items-center">
                  <User className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-gray-600 mr-2">Creado por:</span>
                  <span className="text-sm font-medium">
                    {product.createdBy?.name || "Usuario"}
                  </span>
                </div>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-gray-600 mr-2">Actualización:</span>
                  <span className="text-sm">
                    {formatDate(product.updatedAt)}
                  </span>
                </div>

                <div className="flex items-center">
                  <User className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-gray-600 mr-2">Actualizado por:</span>
                  <span className="text-sm font-medium">
                    {product.updatedBy?.name || "Usuario"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No se encontró información del producto
            </p>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
