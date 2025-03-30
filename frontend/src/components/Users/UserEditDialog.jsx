import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import UserForm from "./UserForm";

/**
 * Componente para el diálogo de edición de usuarios
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.open - Estado de apertura del diálogo
 * @param {Function} props.onOpenChange - Función para cambiar el estado de apertura
 * @param {Function} props.onSubmit - Función que se ejecuta al enviar el formulario
 * @param {Object} props.user - Usuario a editar
 */
const UserEditDialog = ({ open, onOpenChange, onSubmit, user }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // Estado de validación
  const [isValid, setIsValid] = useState(true); // Por defecto es válido (puede no cambiar contraseña)

  // Actualizar valores iniciales cuando cambia el usuario
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "", // No mostrar contraseña actual por seguridad
        role: user.role || "Asesor",
      });
    }
  }, [user]);

  // Manejador de cambios en el formulario
  const handleFormChange = (data) => {
    setFormData(data);

    // Validar que todos los campos requeridos estén completos
    // En edición, la contraseña es opcional
    const { name, email, password, role } = data;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    const valid =
      name.trim() !== "" &&
      email.trim() !== "" &&
      role.trim() !== "" &&
      emailRegex.test(email) &&
      (password === "" || passwordRegex.test(password)); // Contraseña opcional en edición

    setIsValid(valid);
  };

  // Manejador para enviar el formulario
  const handleSubmit = () => {
    // Validación final antes de enviar
    const { name, email, password, role } = formData;

    if (!name.trim() || !email.trim() || !role.trim()) {
      toast.error("Por favor complete los campos obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingrese un correo electrónico válido");
      return;
    }

    // Si se ingresó una contraseña, validarla
    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        toast.error(
          "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
        );
        return;
      }
    }

    // Enviar datos al componente padre
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica los datos del usuario seleccionado.
          </DialogDescription>
        </DialogHeader>

        <UserForm
          defaultValues={formData}
          onChange={handleFormChange}
          isEdit={true}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditDialog;
