import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Componente para el diálogo de confirmación de eliminación de usuarios
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.open - Estado de apertura del diálogo
 * @param {Function} props.onOpenChange - Función para cambiar el estado de apertura
 * @param {Function} props.onConfirm - Función que se ejecuta al confirmar la eliminación
 * @param {Object} props.user - Usuario a eliminar
 */
const UserDeleteDialog = ({ open, onOpenChange, onConfirm, user }) => {
  // Manejador para confirmar la eliminación
  const handleConfirm = () => {
    onConfirm();
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Eliminar Usuario</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. ¿Estás seguro de que deseas
            eliminar a este usuario?
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 bg-gray-50 rounded-lg my-2">
          <p className="font-medium">{user.name}</p>
          <p className="text-gray-600 text-sm">{user.email}</p>
          <p className="text-gray-600 text-sm">Rol: {user.role}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDeleteDialog;
