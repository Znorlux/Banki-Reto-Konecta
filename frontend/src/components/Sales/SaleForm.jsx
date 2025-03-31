import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
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

/**
 * Componente para el formulario de radicación de ventas
 * Adaptado para conectar con la API
 */
const SaleForm = ({ onSubmit, loading, currentUser }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    product: "",
    requestedQuota: "",
    franchise: "",
    rate: "",
  });

  // Estados para mostrar/ocultar campos condicionales
  const [showFranchise, setShowFranchise] = useState(false);
  const [showRate, setShowRate] = useState(false);

  // Estado para validación
  const [errors, setErrors] = useState({});
  const [formValid, setFormValid] = useState(false);

  // Función para formatear números con separadores de miles
  const formatNumber = (value) => {
    // Eliminar caracteres no numéricos
    const numericValue = value.replace(/\D/g, "");

    // Formatear con separadores de miles
    if (numericValue === "") return "";
    return new Intl.NumberFormat("es-CO").format(numericValue);
  };

  // Validar el formulario cuando cambian los datos
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Actualizar campos condicionales según el producto seleccionado
  useEffect(() => {
    if (formData.product === "Tarjeta de Credito") {
      setShowFranchise(true);
      setShowRate(false);

      // Limpiar el valor de tasa si está establecido
      if (formData.rate) {
        setFormData((prev) => ({ ...prev, rate: "" }));
      }
    } else if (
      ["Credito de Consumo", "Libranza Libre Inversión"].includes(
        formData.product
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

      // Limpiar valores si no hay producto seleccionado
      setFormData((prev) => ({ ...prev, franchise: "", rate: "" }));
    }
  }, [formData.product]);

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar producto
    if (!formData.product) {
      newErrors.product = "Debe seleccionar un producto";
    }

    // Validar cupo solicitado
    if (!formData.requestedQuota) {
      newErrors.requestedQuota = "Debe ingresar el cupo solicitado";
    } else if (formData.requestedQuota.replace(/\D/g, "").length > 20) {
      newErrors.requestedQuota = "El cupo no debe exceder 20 caracteres";
    }

    // Validar franquicia si es tarjeta de crédito
    if (formData.product === "Tarjeta de Credito" && !formData.franchise) {
      newErrors.franchise = "Debe seleccionar una franquicia";
    }

    // Validar tasa si es crédito de consumo o libranza
    if (
      ["Credito de Consumo", "Libranza Libre Inversión"].includes(
        formData.product
      )
    ) {
      if (!formData.rate) {
        newErrors.rate = "Debe ingresar una tasa";
      } else if (!/^\d{1,2}(\.\d{1,2})?$/.test(formData.rate)) {
        newErrors.rate = "La tasa debe tener el formato NN.NN";
      }
    }

    setErrors(newErrors);
    setFormValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  };

  // Manejadores de cambios en los campos
  const handleProductChange = (value) => {
    setFormData((prev) => ({ ...prev, product: value }));
  };

  const handleFranchiseChange = (value) => {
    setFormData((prev) => ({ ...prev, franchise: value }));
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

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Enviar datos al componente padre
      onSubmit(formData);
    }
  };

  return (
    <Card className="shadow-md border border-gray-100">
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-6">
          {/* Tipo de Producto */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="product" className="text-base">
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
                      Selecciona el tipo de producto financiero que deseas
                      radicar. Algunos campos cambiarán según el producto
                      seleccionado.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={formData.product}
              onValueChange={handleProductChange}
            >
              <SelectTrigger
                id="product"
                className={`w-full ${errors.product ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credito de Consumo">
                  Crédito de Consumo
                </SelectItem>
                <SelectItem value="Libranza Libre Inversión">
                  Libranza Libre Inversión
                </SelectItem>
                <SelectItem value="Tarjeta de Credito">
                  Tarjeta de Crédito
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.product && (
              <p className="text-sm text-red-500">{errors.product}</p>
            )}
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
                      Ingresa el monto solicitado por el cliente. El valor se
                      formateará automáticamente con separadores de miles.
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
                className={`pl-6 ${
                  errors.requestedQuota ? "border-red-500" : ""
                }`}
                placeholder="1,000,000"
                disabled={loading}
              />
            </div>
            {errors.requestedQuota && (
              <p className="text-sm text-red-500">{errors.requestedQuota}</p>
            )}
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
                        Selecciona la franquicia de la tarjeta de crédito. Este
                        campo solo aparece para productos tipo Tarjeta de
                        Crédito.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={formData.franchise}
                onValueChange={handleFranchiseChange}
              >
                <SelectTrigger
                  id="franchise"
                  className={`w-full ${
                    errors.franchise ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Seleccionar franquicia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMEX">AMEX</SelectItem>
                  <SelectItem value="VISA">VISA</SelectItem>
                  <SelectItem value="MASTERCARD">MASTERCARD</SelectItem>
                </SelectContent>
              </Select>
              {errors.franchise && (
                <p className="text-sm text-red-500">{errors.franchise}</p>
              )}
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
                        Ingresa la tasa de interés con formato NN.NN (por
                        ejemplo: 10.58). Este campo solo aparece para Crédito de
                        Consumo o Libranza.
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
                  className={`${errors.rate ? "border-red-500" : ""}`}
                  placeholder="10.58"
                  disabled={loading}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </span>
              </div>
              {errors.rate && (
                <p className="text-sm text-red-500">{errors.rate}</p>
              )}
            </div>
          )}

          {/* Información del usuario (solo mostrar) */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <Label className="text-base text-gray-700">Radicado por</Label>
            <p className="text-sm text-gray-600">
              La venta será radicada por:{" "}
              <span className="font-semibold">{currentUser.name}</span>
            </p>
            <p className="text-xs text-gray-500">
              La fecha y hora de creación y actualización se registrarán
              automáticamente.
            </p>
          </div>
        </CardContent>

        <CardFooter className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!formValid || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Procesando..." : "Radicar Venta"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SaleForm;
