import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import UsersHeader from "@/components/Users/UsersHeader";
import UsersTable from "@/components/Users/UsersTable";
import UserCreateDialog from "@/components/Users/UserCreateDialog";
import UserEditDialog from "@/components/Users/UserEditDialog";
import UserDeleteDialog from "@/components/Users/UserDeleteDialog";

// URL base de la API
const API_URL = "http://localhost:5000/api";

const Users = () => {
  // Estados
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("userToken");

        const response = await axios.get(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data);
        } else {
          throw new Error("Error al cargar usuarios");
        }
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        setError("No se pudieron cargar los usuarios. Intente nuevamente.");
        toast.error("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Efecto para aplicar filtros
  useEffect(() => {
    if (users.length === 0) return;

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

  // Manejadores de eventos
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
  };

  const handleCreateUser = async (userData) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("userToken");

      const response = await axios.post(`${API_URL}/users`, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        // Actualizar lista de usuarios
        setUsers([...users, response.data.data]);
        toast.success("Usuario creado con éxito");
      } else {
        throw new Error("Error al crear usuario");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      let errorMessage = "Error al crear usuario";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsCreateDialogOpen(false);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      if (!currentUser) return;

      setLoading(true);

      const token = localStorage.getItem("userToken");

      const response = await axios.put(
        `${API_URL}/users/${currentUser.id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Actualizar usuario en la lista
        const updatedUsers = users.map((user) => {
          if (user.id === currentUser.id) {
            return response.data.data;
          }
          return user;
        });

        setUsers(updatedUsers);
        toast.success("Usuario actualizado con éxito");
      } else {
        throw new Error("Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      let errorMessage = "Error al actualizar usuario";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!currentUser) return;

      // Verificar que no se elimine el último administrador
      const adminCount = users.filter((u) => u.role === "ADMINISTRADOR").length;
      if (currentUser.role === "ADMINISTRADOR" && adminCount <= 1) {
        toast.error("No se puede eliminar el último administrador del sistema");
        setIsDeleteDialogOpen(false);
        return;
      }

      setLoading(true);

      const token = localStorage.getItem("userToken");

      const response = await axios.delete(
        `${API_URL}/users/${currentUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Eliminar usuario de la lista
        const updatedUsers = users.filter((user) => user.id !== currentUser.id);
        setUsers(updatedUsers);
        toast.success("Usuario eliminado con éxito");
      } else {
        throw new Error("Error al eliminar usuario");
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      let errorMessage = "Error al eliminar usuario";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
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
    admins: users.filter((u) => u.role === "ADMINISTRADOR").length,
    advisors: users.filter((u) => u.role === "ASESOR").length,
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
      {loading && users.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando usuarios...</span>
        </div>
      ) : error ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      ) : (
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
          adminCount={users.filter((u) => u.role === "ADMINISTRADOR").length}
        />
      )}

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
