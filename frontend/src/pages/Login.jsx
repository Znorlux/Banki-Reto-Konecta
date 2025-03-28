import React, { useState } from "react";
import { Lock, User, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const generateCaptcha = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const [currentCaptcha, setCurrentCaptcha] = useState(generateCaptcha());

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const newErrors = {};

    if (!email) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!validateEmail(email)) {
      newErrors.email = "Formato de correo electrónico inválido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número";
    }

    if (!captcha) {
      newErrors.captcha = "El captcha es obligatorio";
    } else if (captcha.toUpperCase() !== currentCaptcha) {
      newErrors.captcha = "Captcha incorrecto";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Inicio de sesión exitoso", { email });
  };

  const refreshCaptcha = () => {
    setCurrentCaptcha(generateCaptcha());
    setCaptcha("");
    setErrors((prev) => ({ ...prev, captcha: undefined }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl py-6 text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-12 w-12 text-white" strokeWidth={1.5} />
          </div>
          <CardTitle className="text-3xl font-bold mb-2">
            Banki Finanzas
          </CardTitle>
          <p className="text-white/80 text-sm">Acceso Seguro a tu Cuenta</p>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          {loginError && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </Label>
              <div className="relative">
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
                  className="pl-10 py-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className="pl-10 py-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Captcha</Label>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-100 p-2 rounded-lg font-bold text-xl tracking-widest select-none flex-shrink-0 min-w-[120px] text-center">
                  {currentCaptcha}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-gray-300 hover:bg-gray-100"
                  onClick={refreshCaptcha}
                >
                  <RefreshCw className="h-4 w-4 text-gray-600" />
                </Button>
                <Input
                  type="text"
                  placeholder="Ingrese el captcha"
                  value={captcha}
                  onChange={(e) => {
                    setCaptcha(e.target.value);
                    setErrors((prev) => ({ ...prev, captcha: undefined }));
                  }}
                  className="py-2 border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              {errors.captcha && (
                <p className="text-red-500 text-xs mt-1">{errors.captcha}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="text-center mt-4">
            <a
              href="#"
              className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
