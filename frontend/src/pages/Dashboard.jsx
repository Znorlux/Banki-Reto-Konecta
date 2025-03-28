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
import { Briefcase, CreditCard, PieChart, Users, LogOut } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Briefcase className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quota</CardTitle>
            <CreditCard className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalQuota.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card className="bg-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
            <PieChart className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white shadow-lg rounded-lg">
        <div className="p-6 bg-blue-50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-blue-800">
            Financial Products
          </h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + Add New Product
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Requested Quota</TableHead>
              <TableHead>Creation Date</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.product}</TableCell>
                <TableCell>${product.requestedQuota}</TableCell>
                <TableCell>{product.creationDate}</TableCell>
                <TableCell>{product.user}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <button className="text-blue-500 hover:text-blue-700">
                      View
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                      Edit
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
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
