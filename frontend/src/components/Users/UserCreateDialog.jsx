import React, { useState } from "react";
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
 * Componente para el diálogo de creación de usuarios
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.open - Estado de apertura del diálogo
 * @param {Function} props.onOpenChange - Función para cambiar el estado de apertura
 * @param {Function} props.onSubmit - Función que se ejecuta al enviar el formulario
 */
const UserCreateDialog = ({ open, onOpenChange, onSubmit }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Asesor",
  });

  // Estado de validación
  const [isValid, setIsValid] = useState(false);

  // Manejador de cambios en el formulario
  const handleFormChange = (data) => {
    setFormData(data);

    // Validar que todos los campos requeridos estén completos
    const { name, email, password, role } = data;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    const valid =
      name.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      role.trim() !== "" &&
      emailRegex.test(email) &&
      passwordRegex.test(password);

    setIsValid(valid);
  };

  // Manejador para enviar el formulario
  const handleSubmit = () => {
    // Validación final antes de enviar
    const { name, email, password, role } = formData;

    if (!name.trim() || !email.trim() || !password.trim() || !role.trim()) {
      toast.error("Por favor complete todos los campos obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Por favor ingrese un correo electrónico válido");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
      );
      return;
    }

    // Enviar datos al componente padre
    onSubmit(formData);

    // Limpiar formulario
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Asesor",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo usuario. Todos los campos son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <UserForm onChange={handleFormChange} isEdit={false} />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Crear Usuario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserCreateDialog;
