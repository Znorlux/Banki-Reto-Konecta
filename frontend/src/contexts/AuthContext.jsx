import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_URL = "http://localhost:5000/api";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Verificar la autenticación al cargar
  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          // Configurar axios
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Obtener información del usuario en nuestro endpoint
          const response = await axios.get(`${API_URL}/auth/me`);

          if (response.data.success && response.data.data) {
            setUser(response.data.data);
          } else {
            handleLogout(false);
          }
        } catch (error) {
          console.error("Error verificando autenticación:", error);
          // Limpiar datos en caso de error
          handleLogout(false);
        }
      } else {
        // No hay token
        setUser(null);
      }

      setLoading(false);
      setInitialized(true);
    };

    verifyAuth();
  }, [token]);

  // lllamada al login
  const login = async (credentials) => {
    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/auth/login`, credentials);

      if (response.data.success && response.data.token) {
        // Guardar token y datos de usuario
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem("userRole", response.data.user.role);
        localStorage.setItem("userId", response.data.user.id.toString());

        // actualiazamos nuestros states
        setToken(response.data.token);
        setUser(response.data.user);

        // Configurar axios para que use el token en las siguientes peticiones
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;

        // notificar todo bien
        toast.success("Inicio de sesión exitoso");

        return { success: true, user: response.data.user };
      } else {
        throw new Error("Respuesta inesperada del servidor");
      }
    } catch (error) {
      console.error("Error en login:", error);
      let errorMessage = "Error al iniciar sesión. Intente nuevamente.";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const handleLogout = (showMessage = true) => {
    // Limpiar localStorage
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");

    // Limpiar estado
    setToken(null);
    setUser(null);

    // Limpiar headers de axios
    delete axios.defaults.headers.common["Authorization"];

    if (showMessage) {
      toast.info("Sesión cerrada correctamente");
      // Redirigir al login
      navigate("/login");
    }
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Valores disponibles en el contexto
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout: handleLogout,
    hasRole,
    initialized,
  };
  // Al final tendremos disponibles todas las funciones y variables que queramos en el contexto
  // y que podremos usar en cualquier componente de la app

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
