import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateCaptcha = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const [currentCaptcha, setCurrentCaptcha] = useState(generateCaptcha());

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    const newErrors = {};

    if (!email) newErrors.email = "El correo electrónico es obligatorio";
    else if (!validateEmail(email))
      newErrors.email = "Formato de correo electrónico inválido";

    if (!password) newErrors.password = "La contraseña es obligatoria";
    else if (!validatePassword(password))
      newErrors.password =
        "La contraseña debe tener 8 caracteres, una mayúscula y un número";

    if (!captcha) newErrors.captcha = "El captcha es obligatorio";
    else if (captcha.toUpperCase() !== currentCaptcha)
      newErrors.captcha = "Captcha incorrecto";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Aquí iría la lógica de autenticación con el backend
      // Por ahora simulamos un delay y success
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulación de la respuesta del servidor
      const userData = {
        id: 1,
        name: "Admin User",
        email: email,
        role: "Administrador", // o "Asesor" para probar ambos roles
      };

      // Guardar datos en localStorage (simulando JWT)
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("userName", userData.name);
      localStorage.setItem("userToken", "fake-jwt-token");

      // Redirigir al dashboard con animación
      navigate("/dashboard", {
        state: {
          animate: true,
          role: userData.role,
        },
      });
    } catch (error) {
      setLoginError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCaptcha = () => {
    setCurrentCaptcha(generateCaptcha());
    setCaptcha("");
    setErrors((prev) => ({ ...prev, captcha: undefined }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-none rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 text-center">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              Banki Finanzas
            </CardTitle>
            <p className="text-white/80 text-sm">Acceso Seguro a tu Cuenta</p>
          </CardHeader>

          <CardContent className="space-y-5 p-6 bg-white">
            {loginError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className="pl-10 py-2 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }}
                    className="pl-10 py-2 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium">Captcha</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="bg-gray-100 p-2 rounded-lg font-bold text-lg tracking-widest min-w-[120px] text-center select-none">
                    {currentCaptcha}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="border-gray-300 hover:bg-gray-100"
                    onClick={refreshCaptcha}
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Ingrese el captcha"
                    value={captcha}
                    onChange={(e) => {
                      setCaptcha(e.target.value);
                      setErrors((prev) => ({
                        ...prev,
                        captcha: undefined,
                      }));
                    }}
                    className="py-2 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
                {errors.captcha && (
                  <p className="text-red-500 text-xs mt-1">{errors.captcha}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
