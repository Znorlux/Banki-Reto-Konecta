import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import { Toaster } from "sonner";
import RadicateSale from "./pages/RadicateSale";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./layout/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" richColors />
      <Routes>
        {/* rutas disponibles para todo el mundo */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Estas rutas protegidas (necesitas estar logueado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales/new" element={<RadicateSale />} />
        </Route>

        {/* Rutas solo para administradores, aqui podriamos poner más */}
        <Route element={<ProtectedRoute allowedRoles={["ADMINISTRADOR"]} />}>
          <Route path="/users" element={<Users />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
