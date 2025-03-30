import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  CalendarCheck,
  BadgeInfo,
  CreditCard as CreditCardIcon,
  Landmark,
  Percent,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

/**
 * Componente que muestra información de ayuda en el panel lateral
 */
const SaleSummary = () => {
  return (
    <div className="space-y-6">
      {/* Card de Información */}
      <Card className="shadow-md border border-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BadgeInfo className="h-5 w-5 text-blue-600" />
            Información
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm text-gray-600 mb-4">
            Completa todos los campos requeridos para radicar una nueva venta de
            producto financiero.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <CreditCardIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Producto</p>
                <p className="text-gray-600">
                  Selecciona uno de los tres productos disponibles: Crédito de
                  Consumo, Libranza Libre Inversión o Tarjeta de Crédito.
                </p>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex items-start gap-3 text-sm">
              <Landmark className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Cupo Solicitado</p>
                <p className="text-gray-600">
                  Ingresa el monto solicitado por el cliente. El valor debe
                  tener formato de miles (ej: 1.000.000).
                </p>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex items-start gap-3 text-sm">
              <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Franquicia</p>
                <p className="text-gray-600">
                  Solo para Tarjetas de Crédito. Selecciona entre AMEX, VISA o
                  MASTERCARD.
                </p>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex items-start gap-3 text-sm">
              <Percent className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Tasa</p>
                <p className="text-gray-600">
                  Solo para Crédito de Consumo y Libranza. Ingresa la tasa con
                  formato NN.NN (ej: 10.58).
                </p>
              </div>
            </div>

            <Separator className="my-2" />

            <div className="flex items-start gap-3 text-sm">
              <CalendarCheck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700">Fechas y Usuario</p>
                <p className="text-gray-600">
                  Las fechas de creación y actualización, así como el usuario
                  que realiza la acción, se registran automáticamente.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Notas Adicionales */}
      <Card className="border border-blue-100 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Nota:</span> Todos los productos
            radicados aparecerán inicialmente con estado "Abierto" en el listado
            de ventas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleSummary;
