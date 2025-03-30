import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  FileText,
  BarChart4,
  LogOut,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = ({ isOpen, userRole, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay para cerrar el sidebar en móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 h-full bg-white border-r shadow-md z-50
        w-64 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}
      >
        <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 className="text-xl font-bold">Banki Finanzas</h2>
          <p className="text-blue-100 text-sm mt-1">Panel de Administración</p>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <UserCircle className="w-10 h-10 text-blue-600" />
              <div>
                <p className="font-medium text-gray-800">
                  {localStorage.getItem("userName") || "Admin User"}
                </p>
                <p className="text-sm text-gray-500">{userRole}</p>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-400 mb-2 ml-3 uppercase">
                Menú Principal
              </p>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/dashboard")}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Dashboard
              </Button>

              {userRole === "Administrador" && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/usuarios")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Usuarios
                </Button>
              )}

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/ventas/nueva")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Radicar Venta
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/estadisticas")}
              >
                <BarChart4 className="mr-2 h-4 w-4" />
                Estadísticas
              </Button>
            </div>
          </ScrollArea>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <Button
              className="w-full justify-start bg-indigo-600 text-white hover:bg-indigo-800"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
