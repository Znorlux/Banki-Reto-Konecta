import React from "react";
import { UserCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WelcomeCard = ({ userName, userRole }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md mb-6">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 p-3 rounded-full">
            <UserCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Bienvenido, {userName}</h2>
            <p className="text-blue-100">Panel de {userRole}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
