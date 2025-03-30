import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import UsersHeader from "@/components/Users/UsersHeader";
import UsersTable from "@/components/Users/UsersTable";
import UserCreateDialog from "@/components/Users/UserCreateDialog";
import UserEditDialog from "@/components/Users/UserEditDialog";
import UserDeleteDialog from "@/components/Users/UserDeleteDialog";

// Datos iniciales para demostración (en un escenario real vendrían del backend)
const initialUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@banki.com",
    role: "Administrador",
    creationDate: "2024-03-20 09:30:00",
    updateDate: "2024-03-20 09:30:00",
  },
  {
    id: 2,
    name: "Juan Pérez",
    email: "juan@banki.com",
    role: "Asesor",
    creationDate: "2024-03-21 10:15:00",
    updateDate: "2024-03-21 10:15:00",
  },
  {
    id: 3,
    name: "María González",
    email: "maria@banki.com",
    role: "Asesor",
    creationDate: "2024-03-22 11:45:00",
    updateDate: "2024-03-22 11:45:00",
  },
  {
    id: 4,
    name: "Carlos Rodríguez",
    email: "carlos@banki.com",
    role: "Asesor",
    creationDate: "2024-03-23 15:20:00",
    updateDate: "2024-03-25 09:10:00",
  },
];

const Users = () => {
  const navigate = useNavigate();

  // Estados
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Efecto para aplicar filtros
  useEffect(() => {
    let result = users;

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro por rol
    if (roleFilter && roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter]);

  // Verificar permisos de administrador
  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "Administrador") {
      navigate("/dashboard");
      toast.error("No tienes permiso para acceder a esta página");
    }
  }, [navigate]);

  // Manejadores de eventos
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
  };

  const handleCreateUser = (userData) => {
    // Generar ID y fechas
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    const newUser = {
      id: Math.max(...users.map((u) => u.id), 0) + 1,
      ...userData,
      creationDate: now,
      updateDate: now,
    };

    setUsers([...users, newUser]);
    toast.success("Usuario creado con éxito");
    setIsCreateDialogOpen(false);
  };

  const handleUpdateUser = (userData) => {
    // Actualizar usuario
    const now = new Date().toISOString().replace("T", " ").substring(0, 19);
    const updatedUsers = users.map((user) => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          ...userData,
          updateDate: now,
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    toast.success("Usuario actualizado con éxito");
    setIsEditDialogOpen(false);
  };

  const handleDeleteUser = () => {
    // Verificar que no se elimine el último administrador
    const adminCount = users.filter((u) => u.role === "Administrador").length;
    if (currentUser.role === "Administrador" && adminCount <= 1) {
      toast.error("No se puede eliminar el último administrador del sistema");
      setIsDeleteDialogOpen(false);
      return;
    }

    // Eliminar usuario
    const updatedUsers = users.filter((user) => user.id !== currentUser.id);
    setUsers(updatedUsers);
    toast.success("Usuario eliminado con éxito");
    setIsDeleteDialogOpen(false);
  };

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (user) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Stats para el encabezado
  const userStats = {
    total: users.length,
    admins: users.filter((u) => u.role === "Administrador").length,
    advisors: users.filter((u) => u.role === "Asesor").length,
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-500 mt-1">
          Administra los usuarios del sistema y sus permisos
        </p>
      </div>

      {/* Header con stats y botón de nuevo usuario */}
      <UsersHeader stats={userStats} onCreateClick={openCreateDialog} />

      {/* Tabla de usuarios con filtros */}
      <UsersTable
        users={filteredUsers}
        onSearchChange={handleSearchChange}
        onRoleFilterChange={handleRoleFilterChange}
        roleFilter={roleFilter}
        onView={(user) => {
          toast.info(`Visualizando a ${user.name}`);
        }}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        adminCount={users.filter((u) => u.role === "Administrador").length}
      />

      {/* Diálogos para CRUD */}
      <UserCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateUser}
      />

      {currentUser && (
        <>
          <UserEditDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSubmit={handleUpdateUser}
            user={currentUser}
          />

          <UserDeleteDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteUser}
            user={currentUser}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default Users;
