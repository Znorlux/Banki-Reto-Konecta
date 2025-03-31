import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Briefcase,
  Users,
  FileText,
  BarChart4,
  LogOut,
  UserCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Obtener el rol del usuario del contexto de autenticación
  const userRole = user?.role || "ASESOR";

  // Convertir rol a formato de visualización (primera letra mayúscula, resto minúscula)
  const displayRole = userRole === "ADMINISTRADOR" ? "Administrador" : "Asesor";

  // Function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Usar la función logout del AuthContext
    logout();
  };

  // Menu items - Adaptados a las rutas correctas
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Briefcase className="h-5 w-5" />,
      showTo: ["ADMINISTRADOR", "ASESOR"],
    },
    {
      name: "Usuarios",
      path: "/users",
      icon: <Users className="h-5 w-5" />,
      showTo: ["ADMINISTRADOR"],
    },
    {
      name: "Radicar Venta",
      path: "/sales/new",
      icon: <FileText className="h-5 w-5" />,
      showTo: ["ADMINISTRADOR", "ASESOR"],
    },
    {
      name: "Estadísticas",
      path: "/stats",
      icon: <BarChart4 className="h-5 w-5" />,
      showTo: ["ADMINISTRADOR", "ASESOR"],
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r z-50
          w-64 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 shadow-xl
        `}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white">
          <div className="p-5 pb-7">
            <h2 className="text-2xl font-bold tracking-tight">
              Banki Finanzas
            </h2>
            <p className="text-blue-100 text-sm mt-1 opacity-80">
              Panel de Administración
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 pb-0">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
            <div className="bg-white rounded-full p-1.5 shadow-sm">
              <UserCircle className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-medium text-gray-800 leading-tight">
                {user?.name || "Usuario"}
              </p>
              <p className="text-xs text-blue-600 font-medium mt-0.5">
                {displayRole}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <ScrollArea className="py-4 px-3 h-[calc(100vh-235px)]">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2 pl-4 uppercase tracking-wider">
                Menú Principal
              </p>
              <nav className="space-y-1">
                {menuItems
                  .filter((item) => item.showTo.includes(userRole))
                  .map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start h-10 px-4 mb-1 font-medium",
                        isActive(item.path)
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      <div className="flex items-center w-full">
                        <span
                          className={cn(
                            "mr-3",
                            isActive(item.path) ? "text-white" : "text-blue-600"
                          )}
                        >
                          {item.icon}
                        </span>
                        {item.name}
                        {isActive(item.path) && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </div>
                    </Button>
                  ))}
              </nav>
            </div>
          </div>
        </ScrollArea>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-3 border-t bg-white">
          <Button
            className="w-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100 shadow-sm font-medium"
            variant="outline"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
