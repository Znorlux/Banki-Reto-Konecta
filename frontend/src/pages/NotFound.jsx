import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-12 rounded-xl shadow-2xl text-center">
        <AlertTriangle className="mx-auto text-red-500 mb-6" size={96} />
        <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          Oops! La pagina que buscas no existe.
        </p>
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
