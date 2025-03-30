import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Componente reutilizable para el formulario de usuarios
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.defaultValues - Valores por defecto del formulario
 * @param {Function} props.onChange - Función que se ejecuta cuando cambia el formulario
 * @param {boolean} props.isEdit - Indica si el formulario es para edición
 */
const UserForm = ({ defaultValues = {}, onChange, isEdit = false }) => {
  // Estado del formulario
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    role: "Asesor",
    ...defaultValues,
  });

  // Propagar cambios iniciales
  useEffect(() => {
    onChange(formValues);
  }, []);

  // Validaciones
  const [errors, setErrors] = useState({});

  // Manejador para cambios en inputs de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Actualizar valores
    const newValues = { ...formValues, [name]: value };
    setFormValues(newValues);

    // Validar campo específico
    validateField(name, value);

    // Propagar cambio al componente padre
    onChange(newValues);
  };

  // Manejador para cambio de rol
  const handleRoleChange = (value) => {
    const newValues = { ...formValues, role: value };
    setFormValues(newValues);
    onChange(newValues);
  };

  // Validación de campos individuales
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "El nombre es obligatorio";
        } else if (value.length > 50) {
          newErrors.name = "El nombre no debe exceder 50 caracteres";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = "El correo electrónico es obligatorio";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Ingrese un correo electrónico válido";
        } else if (value.length > 50) {
          newErrors.email = "El correo no debe exceder 50 caracteres";
        } else {
          delete newErrors.email;
        }
        break;

      case "password":
        // En modo edición, la contraseña es opcional
        if (isEdit && !value) {
          delete newErrors.password;
          break;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!value && !isEdit) {
          newErrors.password = "La contraseña es obligatoria";
        } else if (value && !passwordRegex.test(value)) {
          newErrors.password =
            "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número";
        } else if (value && value.length > 20) {
          newErrors.password = "La contraseña no debe exceder 20 caracteres";
        } else {
          delete newErrors.password;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="name">
          Nombre <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Nombre completo"
          value={formValues.name}
          onChange={handleInputChange}
          maxLength={50}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Correo Electrónico <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={formValues.email}
          onChange={handleInputChange}
          maxLength={50}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          {isEdit ? (
            <>
              Nueva Contraseña{" "}
              <span className="text-gray-500 text-xs">(opcional)</span>
            </>
          ) : (
            <>
              Contraseña <span className="text-red-500">*</span>
            </>
          )}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={
            isEdit
              ? "Dejar en blanco para mantener la actual"
              : "Contraseña segura"
          }
          value={formValues.password}
          onChange={handleInputChange}
          maxLength={20}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password ? (
          <p className="text-xs text-red-500">{errors.password}</p>
        ) : (
          <p className="text-xs text-gray-500">
            Mínimo 8 caracteres, una mayúscula y un número
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">
          Rol del Usuario <span className="text-red-500">*</span>
        </Label>
        <Select value={formValues.role} onValueChange={handleRoleChange}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Seleccionar rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Administrador">Administrador</SelectItem>
            <SelectItem value="Asesor">Asesor</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserForm;
