import React from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProductTable = ({ products, onAdd, onView, onEdit, onDelete }) => {
  return (
    <Card className="shadow-md rounded-xl overflow-hidden border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5 px-6 bg-white border-b">
        <CardTitle className="text-lg font-bold text-gray-800">
          Productos financieros
        </CardTitle>
        <Button
          onClick={onAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-gray-800 rounded-lg px-4"
        >
          <Plus className="h-4 w-4" />
          <span>Añadir nuevo producto</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-none">
                <TableHead className="py-3 px-6 text-sm font-medium text-gray-700">
                  Producto
                </TableHead>
                <TableHead className="py-3 px-6 text-sm font-medium text-gray-700">
                  Valor
                </TableHead>
                <TableHead className="py-3 px-6 text-sm font-medium text-gray-700">
                  Fecha de creación
                </TableHead>
                <TableHead className="py-3 px-6 text-sm font-medium text-gray-700">
                  Creado por
                </TableHead>
                <TableHead className="py-3 px-6 text-sm font-medium text-gray-700 text-center">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-gray-50 border-t border-gray-100"
                >
                  <TableCell className="py-4 px-6 font-medium text-gray-800">
                    {product.product}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-green-600 font-semibold">
                    $
                    {typeof product.requestedQuota === "number"
                      ? product.requestedQuota.toLocaleString()
                      : product.requestedQuota}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-600">
                    {product.creationDate}
                  </TableCell>
                  <TableCell className="py-4 px-6 text-gray-600">
                    {product.user}
                  </TableCell>
                  <TableCell className="py-3 px-6">
                    <div className="flex items-center justify-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(product.id)}
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product.id)}
                        className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
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
      </CardContent>
    </Card>
  );
};

export default ProductTable;
