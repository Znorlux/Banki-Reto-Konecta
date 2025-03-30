import React from "react";
import { Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Componente reutilizable para tarjetas de estadísticas
const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  bgColor,
  iconColor,
}) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-500 text-sm font-medium">{title}</div>
          <div className={`${bgColor} p-2 rounded-lg`}>
            {React.cloneElement(icon, { className: `h-5 w-5 ${iconColor}` })}
          </div>
        </div>

        <div className="text-3xl font-bold text-gray-800">{value}</div>

        {trend && (
          <div className="text-green-500 text-sm mt-2 flex items-center">
            <Activity className="w-4 h-4 mr-1" />
            <span>{trendValue}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
