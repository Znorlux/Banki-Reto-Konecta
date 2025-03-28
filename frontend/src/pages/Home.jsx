import React from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  DollarSign,
  Landmark,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";

const Home = () => {
  const features = [
    {
      icon: CreditCard,
      color: "blue",
      title: "Tarjetas de Crédito",
      description: "Compra lo que quieras, cuando quieras. Sin preocupaciones.",
    },
    {
      icon: DollarSign,
      color: "green",
      title: "Préstamos Personales y Empresariales",
      description:
        "Haz crecer tus sueños con opciones de financiamiento accesibles.",
    },
    {
      icon: Landmark,
      color: "purple",
      title: "Inversiones Inteligentes",
      description:
        "Pon tu dinero a trabajar por ti. Estrategias que generan resultados.",
    },
    {
      icon: ShieldCheck,
      color: "red",
      title: "Seguridad de Primer Nivel",
      description:
        "Tu dinero y datos siempre protegidos con la mejor tecnología.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <section className="text-center space-y-6">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-900 leading-tight">
            Tu dinero, tus reglas
          </h1>
          <h2 className="text-4xl font-bold text-blue-800 mb-4">
            Finanzas sin complicaciones
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
            Desde tarjetas de crédito flexibles hasta inversiones inteligentes,
            todo en un solo lugar. Manejar tu dinero nunca había sido tan fácil
            y seguro.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-4 gap-8 mt-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/80 rounded-2xl shadow-lg p-6 text-center 
                           hover:shadow-2xl hover:scale-105 transition-all duration-300 
                           group overflow-hidden relative"
              >
                <div className="absolute -top-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <IconComponent
                    size={120}
                    className={`text-${feature.color}-600`}
                  />
                </div>
                <IconComponent
                  className={`mx-auto text-${feature.color}-600 mb-4 group-hover:scale-110 transition-transform`}
                  size={64}
                />
                <h3 className="text-xl font-bold mb-3 text-blue-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </section>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link
            to="/login"
            className="px-10 py-4 rounded-full text-xl font-bold 
                       bg-gradient-to-r from-blue-600 to-blue-800 
                       text-white shadow-lg hover:shadow-xl 
                       transform hover:-translate-y-1 transition-all 
                       inline-flex items-center group"
          >
            Comienza ahora
            <ChevronRight
              className="ml-2 group-hover:translate-x-1 transition-transform"
              size={24}
            />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
