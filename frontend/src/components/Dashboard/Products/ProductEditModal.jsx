import React, { useState, useEffect } from "react";
import { Loader2, HelpCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// URL base de la API
const API_URL = "http://localhost:5000/api";

/**
 * Modal para editar un producto
 */
const ProductEditModal = ({
  productId,
  open,
  onOpenChange,
  onProductUpdated,
}) => {
  // Estados
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para campos de formulario
  const [formData, setFormData] = useState({
    productType: "",
    requestedQuota: "",
    franchise: "",
    rate: "",
    status: "",
  });

  // Estados para mostrar/ocultar campos condicionales
  const [showFranchise, setShowFranchise] = useState(false);
  const [showRate, setShowRate] = useState(false);

  // Cargar los detalles del producto cuando se abre el modal
  useEffect(() => {
    if (open && productId) {
      fetchProductDetails();
    }
  }, [open, productId]);

  // Actualizar campos condicionales según el tipo de producto
  useEffect(() => {
    if (formData.productType === "TARJETA_DE_CREDITO") {
      setShowFranchise(true);
      setShowRate(false);

      // Limpiar el valor de tasa si está establecido
      if (formData.rate) {
        setFormData((prev) => ({ ...prev, rate: "" }));
      }
    } else if (
      ["CREDITO_DE_CONSUMO", "LIBRANZA_LIBRE_INVERSION"].includes(
        formData.productType
      )
    ) {
      setShowFranchise(false);
      setShowRate(true);

      // Limpiar el valor de franquicia si está establecido
      if (formData.franchise) {
        setFormData((prev) => ({ ...prev, franchise: "" }));
      }
    } else {
      setShowFranchise(false);
      setShowRate(false);
    }
  }, [formData.productType]);

  // Función para obtener los detalles del producto
  const fetchProductDetails = async () => {
    try {
      setFetchLoading(true);
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
        const productData = response.data.data;
        setProduct(productData);

        // Inicializar formulario con datos del producto
        setFormData({
          productType: productData.productType,
          requestedQuota: productData.requestedQuota.toLocaleString(),
          franchise: productData.franchise || "",
          rate: productData.rate ? productData.rate.toString() : "",
          status: productData.status,
        });
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
      toast.error("Error al cargar detalles del producto");
    } finally {
      setFetchLoading(false);
    }
  };

  // Función para actualizar el producto
  const handleUpdateProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validar campos obligatorios
      if (!formData.productType || !formData.requestedQuota) {
        toast.error("Por favor complete los campos obligatorios");
        return;
      }

      // Validaciones específicas según el tipo de producto
      if (
        formData.productType === "TARJETA_DE_CREDITO" &&
        !formData.franchise
      ) {
        toast.error("La franquicia es obligatoria para tarjetas de crédito");
        return;
      }

      if (
        ["CREDITO_DE_CONSUMO", "LIBRANZA_LIBRE_INVERSION"].includes(
          formData.productType
        ) &&
        !formData.rate
      ) {
        toast.error("La tasa es obligatoria para créditos y libranzas");
        return;
      }

      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      // Convertir valores a los tipos correctos
      const requestedQuota = parseInt(
        formData.requestedQuota.replace(/\D/g, ""),
        10
      );
      const rate = formData.rate ? parseFloat(formData.rate) : null;

      // Preparar datos para enviar
      const updatedData = {
        productType: formData.productType,
        requestedQuota: requestedQuota,
        franchise:
          formData.productType === "TARJETA_DE_CREDITO"
            ? formData.franchise
            : null,
        rate: ["CREDITO_DE_CONSUMO", "LIBRANZA_LIBRE_INVERSION"].includes(
          formData.productType
        )
          ? rate
          : null,
        status: formData.status,
      };

      const response = await axios.put(
        `${API_URL}/products/${productId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Producto actualizado con éxito");

        // Notificar al componente padre
        if (onProductUpdated) {
          onProductUpdated(response.data.data);
        }

        // Cerrar modal
        onOpenChange(false);
      } else {
        throw new Error(
          response.data.message || "Error al actualizar producto"
        );
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);

      let errorMessage = "Error al actualizar producto";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear números con separadores de miles
  const formatNumber = (value) => {
    // Eliminar caracteres no numéricos
    const numericValue = value.replace(/\D/g, "");

    // Formatear con separadores de miles
    if (numericValue === "") return "";
    return new Intl.NumberFormat("es-CO").format(numericValue);
  };

  // Manejadores de cambios en los campos
  const handleProductTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, productType: value }));
  };

  const handleFranchiseChange = (value) => {
    setFormData((prev) => ({ ...prev, franchise: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleRequestedQuotaChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      requestedQuota: formatNumber(value),
    }));
  };

  const handleRateChange = (e) => {
    const { value } = e.target;
    // Permitir solo números y un punto decimal con máximo 2 decimales
    const formattedValue = value
      .replace(/[^\d.]/g, "")
      .replace(/\.+/g, ".")
      .replace(/^(\d*\.\d{0,2}).*$/, "$1");

    setFormData((prev) => ({ ...prev, rate: formattedValue }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Producto</DialogTitle>
          <DialogDescription>
            Modifica los detalles del producto financiero
          </DialogDescription>
        </DialogHeader>

        {fetchLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando detalles...</span>
          </div>
        ) : error && !product ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchProductDetails} variant="outline">
              Reintentar
            </Button>
          </div>
        ) : product ? (
          <div className="space-y-4 py-2">
            {/* Tipo de Producto */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="productType" className="text-base">
                  Tipo de Producto <span className="text-red-500">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        El tipo de producto determina qué campos adicionales se
                        mostrarán.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={formData.productType}
                onValueChange={handleProductTypeChange}
              >
                <SelectTrigger id="productType">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREDITO_DE_CONSUMO">
                    Crédito de Consumo
                  </SelectItem>
                  <SelectItem value="LIBRANZA_LIBRE_INVERSION">
                    Libranza Libre Inversión
                  </SelectItem>
                  <SelectItem value="TARJETA_DE_CREDITO">
                    Tarjeta de Crédito
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cupo Solicitado */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="requestedQuota" className="text-base">
                  Cupo Solicitado <span className="text-red-500">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        El monto solicitado por el cliente, se formatea
                        automáticamente.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="requestedQuota"
                  value={formData.requestedQuota}
                  onChange={handleRequestedQuotaChange}
                  className="pl-6"
                  placeholder="1,000,000"
                />
              </div>
            </div>

            {/* Franquicia (condicional) */}
            {showFranchise && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="franchise" className="text-base">
                    Franquicia <span className="text-red-500">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          Franquicia de la tarjeta de crédito.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select
                  value={formData.franchise}
                  onValueChange={handleFranchiseChange}
                >
                  <SelectTrigger id="franchise">
                    <SelectValue placeholder="Seleccionar franquicia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AMEX">AMEX</SelectItem>
                    <SelectItem value="VISA">VISA</SelectItem>
                    <SelectItem value="MASTERCARD">MASTERCARD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Tasa (condicional) */}
            {showRate && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rate" className="text-base">
                    Tasa <span className="text-red-500">*</span>
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-[200px] text-xs">
                          Tasa de interés con formato NN.NN (ej: 10.58).
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <Input
                    id="rate"
                    value={formData.rate}
                    onChange={handleRateChange}
                    placeholder="10.58"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </div>
            )}

            {/* Estado del producto */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="status" className="text-base">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">
                        Estado actual del producto financiero.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABIERTO">Abierto</SelectItem>
                  <SelectItem value="EN_PROCESO">En Proceso</SelectItem>
                  <SelectItem value="FINALIZADO">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No se encontró información del producto
            </p>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpdateProduct}
            disabled={loading || fetchLoading || !product}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
