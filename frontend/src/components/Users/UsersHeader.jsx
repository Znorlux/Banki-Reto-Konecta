import React from "react";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

/**
 * Componente para mostrar el encabezado de la sección de usuarios
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.stats - Estadísticas de usuarios
 * @param {number} props.stats.total - Total de usuarios
 * @param {number} props.stats.admins - Total de administradores
 * @param {number} props.stats.advisors - Total de asesores
 * @param {Function} props.onCreateClick - Función a ejecutar al hacer clic en "Nuevo Usuario"
 */
const UsersHeader = ({ stats, onCreateClick }) => {
  return (
    <Card className="shadow-md rounded-xl overflow-hidden mb-8 border border-gray-100">
      <CardHeader className="bg-white pb-4 pt-6 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Usuarios del Sistema
          </CardTitle>
          <CardDescription>
            Total: {stats.total} usuarios ({stats.admins} administradores,{" "}
            {stats.advisors} asesores)
          </CardDescription>
        </div>

        <Button
          onClick={onCreateClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </CardHeader>
    </Card>
  );
};

export default UsersHeader;
