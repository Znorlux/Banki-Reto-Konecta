import React, { useState } from "react";
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Componente para mostrar la tabla de usuarios con filtros
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.users - Lista de usuarios a mostrar
 * @param {Function} props.onSearchChange - Función para manejar cambios en la búsqueda
 * @param {Function} props.onRoleFilterChange - Función para manejar cambios en el filtro de rol
 * @param {string} props.roleFilter - Valor actual del filtro de rol
 * @param {Function} props.onView - Función para manejar la visualización de un usuario
 * @param {Function} props.onEdit - Función para manejar la edición de un usuario
 * @param {Function} props.onDelete - Función para manejar la eliminación de un usuario
 * @param {number} props.adminCount - Número de administradores en el sistema
 */
const UsersTable = ({
  users,
  onSearchChange,
  onRoleFilterChange,
  roleFilter,
  onView,
  onEdit,
  onDelete,
  adminCount,
}) => {
  // Estado local para el campo de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Manejador para el cambio en el campo de búsqueda
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  return (
    <Card className="shadow-md border border-gray-100 rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="pl-10"
            />
          </div>

          <div className="w-full sm:w-64">
            <Select value={roleFilter} onValueChange={onRoleFilterChange}>
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Filtrar por rol" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                <SelectItem value="ASESOR">Asesor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium text-gray-700">
                  Nombre
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Correo Electrónico
                </TableHead>
                <TableHead className="font-medium text-gray-700">Rol</TableHead>
                <TableHead className="font-medium text-gray-700">
                  Fecha de Creación
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Última Modificación
                </TableHead>
                <TableHead className="font-medium text-gray-700 text-center">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMINISTRADOR" ? "default" : "outline"
                        }
                        className={
                          user.role === "ADMINISTRADOR"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {user.createdAt.split("T")[0]}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {user.updatedAt.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(user)}
                          className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(user)}
                          className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(user)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                          disabled={
                            user.role === "Administrador" && adminCount <= 1
                          }
                          title={
                            user.role === "Administrador" && adminCount <= 1
                              ? "No se puede eliminar el último administrador"
                              : ""
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No se encontraron usuarios que coincidan con la búsqueda
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTable;
