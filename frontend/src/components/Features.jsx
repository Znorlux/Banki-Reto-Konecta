import React from "react";
import {
  CreditCard,
  DollarSign,
  Landmark,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

function Features() {
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
  );
}

export default Features;
