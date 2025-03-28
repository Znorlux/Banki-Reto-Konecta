import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, DollarSign, Landmark, ShieldCheck } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-800">Banki</div>
          <nav className="space-x-6">
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-4">
            Tu dinero, tus reglas. Finanzas sin complicaciones
          </h1>
          <h2 className=" text-3xl text-blue-800 mb-3 font-medium">
            Descubre soluciones financieras diseñadas para ti.
          </h2>
          <p className="text-xl text-blue-700 max-w-2xl mx-auto">
            Desde tarjetas de crédito flexibles hasta inversiones inteligentes,
            todo en un solo lugar. ¡Manejar tu dinero nunca había sido tan
            fácil!.
          </p>
        </section>

        <section className="grid md:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
            <CreditCard className="mx-auto text-blue-600 mb-4" size={64} />
            <h3 className="text-xl font-bold mb-2">Tarjetas de Crédito</h3>
            <p className="text-gray-600">
              Compra lo que quieras, cuando quieras. Sin preocupaciones.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
            <DollarSign className="mx-auto text-green-600 mb-4" size={64} />
            <h3 className="text-xl font-bold mb-2">
              Préstamos Personales y Empresariales
            </h3>
            <p className="text-gray-600">
              Haz crecer tus sueños con opciones de financiamiento accesibles.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
            <Landmark className="mx-auto text-purple-600 mb-4" size={64} />
            <h3 className="text-xl font-bold mb-2">
              Inversiones Inteligentes{" "}
            </h3>
            <p className="text-gray-600">
              Pon tu dinero a trabajar por ti. Estrategias que generan
              resultados.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
            <ShieldCheck className="mx-auto text-red-600 mb-4" size={64} />
            <h3 className="text-xl font-bold mb-2">
              Seguridad de Primer Nivel
            </h3>
            <p className="text-gray-600">
              Tu dinero y datos siempre protegidos con la mejor tecnología.
            </p>
          </div>
        </section>

        <div className="text-center mt-16">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-xl hover:bg-blue-700 transition"
          >
            Comienza ahora
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
