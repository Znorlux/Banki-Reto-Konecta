import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

/**
 * Componente para el encabezado de secciones del formulario de ventas
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.icon - Icono a mostrar
 * @param {string} props.title - Título de la sección
 * @param {string} props.description - Descripción de la sección
 */
const SaleFormHeader = ({ icon, title, description }) => {
  return (
    <Card className="shadow-md border border-gray-100 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-600">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default SaleFormHeader;
