import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  CreditCard,
  PieChart,
  Users,
  Edit,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      product: "Credito de Consumo",
      requestedQuota: "1,000,000",
      creationDate: "2024-03-27",
      user: "Juan Pérez",
    },
    {
      id: 2,
      product: "Tarjeta de Credito",
      requestedQuota: "5,000,000",
      creationDate: "2024-03-26",
      user: "María González",
    },
  ]);

  const totalQuota = products.reduce(
    (sum, product) =>
      sum + parseInt(product.requestedQuota.replace(/,/g, ""), 10),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-80">
              Productos totales
            </CardTitle>
            <Briefcase className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-80">
              Cuota total
            </CardTitle>
            <CreditCard className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${totalQuota.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-80">
              Usuarios totales
            </CardTitle>
            <Users className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg hover:scale-105 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-80">
              Productos activos
            </CardTitle>
            <PieChart className="h-5 w-5 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-500 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Productos financieros
          </h2>
          <Button
            variant="outline"
            className="bg-white/20 text-white hover:bg-white/30 border-white/30 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Añadir nuevo producto
          </Button>
        </div>
        <Table>
          <TableHeader className="bg-blue-50">
            <TableRow>
              <TableHead className="text-blue-800">Producto</TableHead>
              <TableHead className="text-blue-800">Valor</TableHead>
              <TableHead className="text-blue-800">Fecha de creación</TableHead>
              <TableHead className="text-blue-800">Creado por</TableHead>
              <TableHead className="text-blue-800">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-blue-50/50">
                <TableCell className="font-medium">{product.product}</TableCell>
                <TableCell className="text-green-600 font-semibold">
                  ${product.requestedQuota}
                </TableCell>
                <TableCell className="text-gray-600">
                  {product.creationDate}
                </TableCell>
                <TableCell className="text-gray-600">{product.user}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-500 hover:text-green-700 hover:bg-green-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
