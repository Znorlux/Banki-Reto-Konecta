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

// Componente para la tabla de productos
const ProductTable = ({ products, onAdd, onView, onEdit, onDelete }) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="text-lg font-bold text-gray-800">
          Productos financieros
        </CardTitle>
        <Button onClick={onAdd} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          <span>Añadir nuevo producto</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead>Creado por</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {product.product}
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    $
                    {typeof product.requestedQuota === "number"
                      ? product.requestedQuota.toLocaleString()
                      : product.requestedQuota}
                  </TableCell>
                  <TableCell>{product.creationDate}</TableCell>
                  <TableCell>{product.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(product.id)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product.id)}
                        className="text-green-600 hover:text-green-800 hover:bg-green-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
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
