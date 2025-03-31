import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

import ProductDetailModal from "./Products/ProductDetailModal";
import ProductEditModal from "./Products/ProductEditModal";

// URL base de la API
const API_URL = "http://localhost:5000/api";

/**
 * Componente para mostrar la lista de productos en el dashboard
 */
const ProductTable = ({ onProductsLoaded }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalQuota, setTotalQuota] = useState(0);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para obtener los productos del backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.get(`${API_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalQuota(response.data.totalQuota);

        // Pasar los datos al componente padre si es necesario
        if (onProductsLoaded) {
          onProductsLoaded({
            products: response.data.data,
            totalQuota: response.data.totalQuota,
          });
        }
      } else {
        throw new Error(response.data.message || "Error al cargar productos");
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setError("No se pudieron cargar los productos. Intente nuevamente.");
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar diálogo de eliminación
  const handleDeleteClick = (product) => {
    setDeleteProduct(product);
    setDeleteDialogOpen(true);
  };

  // Función para mostrar modal de detalles
  const handleViewClick = (productId) => {
    setSelectedProductId(productId);
    setDetailModalOpen(true);
  };

  const handleEditClick = (productId) => {
    setSelectedProductId(productId);
    setEditModalOpen(true);
  };

  // Función para eliminar producto
  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("userToken");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.delete(
        `${API_URL}/products/${deleteProduct.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Eliminar el producto de la lista local
        const updatedProducts = products.filter(
          (p) => p.id !== deleteProduct.id
        );
        setProducts(updatedProducts);

        // Recalcular cupo total
        const newTotalQuota = updatedProducts.reduce(
          (sum, product) => sum + product.requestedQuota,
          0
        );
        setTotalQuota(newTotalQuota);

        // Actualizar componente padre si es necesario
        if (onProductsLoaded) {
          onProductsLoaded({
            products: updatedProducts,
            totalQuota: newTotalQuota,
          });
        }

        toast.success("Producto eliminado con éxito");
      } else {
        throw new Error(response.data.message || "Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);

      let errorMessage = "Error al eliminar producto";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setDeleteProduct(null);
    }
  };

  // Función para formatear el tipo de producto
  const formatProductType = (type) => {
    switch (type) {
      case "CREDITO_DE_CONSUMO":
        return "Crédito de Consumo";
      case "LIBRANZA_LIBRE_INVERSION":
        return "Libranza Libre Inversión";
      case "TARJETA_DE_CREDITO":
        return "Tarjeta de Crédito";
      default:
        return type;
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  return (
    <>
      <Card className="shadow-md rounded-xl overflow-hidden border border-gray-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-5 px-6 bg-white border-b">
          <CardTitle className="text-lg font-bold text-gray-800">
            Productos financieros
          </CardTitle>
          <Button
            onClick={() => navigate("/sales/new")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4"
          >
            <Plus className="h-4 w-4" />
            <span>Añadir nuevo producto</span>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {loading && products.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-3 text-gray-600">Cargando productos...</span>
            </div>
          ) : error ? (
            <div className="text-center p-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchProducts} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-4">No hay productos registrados</p>
              <Button
                onClick={() => navigate("/sales/new")}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir nuevo producto
              </Button>
            </div>
          ) : (
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
                    <TableHead className="py-3 px-6 text-sm font-medium text-gray-700">
                      Estado
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
                        {formatProductType(product.productType)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-green-600 font-semibold">
                        ${product.requestedQuota.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-600">
                        {formatDate(product.createdAt)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-600">
                        {product.createdBy?.name || "Usuario"}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge
                          variant={
                            product.status === "ABIERTO" ? "default" : "outline"
                          }
                          className={
                            product.status === "ABIERTO"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : product.status === "EN_PROCESO"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : "bg-green-100 text-green-800 hover:bg-green-100"
                          }
                        >
                          {product.status === "ABIERTO"
                            ? "Abierto"
                            : product.status === "EN_PROCESO"
                            ? "En Proceso"
                            : "Finalizado"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewClick(product.id)}
                            className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(product.id)}
                            className="h-8 w-8 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-full"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(product)}
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
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente el producto y no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteProduct && (
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="font-medium">
                {formatProductType(deleteProduct.productType)}
              </p>
              <p className="text-sm text-gray-500">
                Valor: ${deleteProduct.requestedQuota?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Creado por: {deleteProduct.createdBy?.name || "Usuario"}
              </p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de detalles del producto */}
      <ProductDetailModal
        productId={selectedProductId}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
      />
      <ProductEditModal
        productId={selectedProductId}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </>
  );
};

export default ProductTable;
