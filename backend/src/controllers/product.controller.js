const prisma = require("../lib/prisma");
const { validationResult } = require("express-validator");

/**
 * Controlador para operaciones CRUD de productos financieros
 */
class ProductController {
  /**
   * Obtener todos los productos
   * Los administradores ven todos los productos
   * Los asesores solo ven sus propios productos
   */
  async getAllProducts(req, res) {
    try {
      const { id: userId, role } = req.user;
      let products;

      // Filtrar productos según el rol del usuario
      if (role === "ADMINISTRADOR") {
        // Administradores ven todos los productos
        products = await prisma.product.findMany({
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            updatedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      } else {
        // Asesores solo ven sus propios productos
        products = await prisma.product.findMany({
          where: {
            createdById: userId,
          },
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            updatedBy: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      }

      // Calcular la suma total de cupos
      const totalQuota = products.reduce(
        (sum, product) => sum + product.requestedQuota,
        0
      );

      return res.status(200).json({
        success: true,
        count: products.length,
        totalQuota,
        data: products,
      });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener productos",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Obtener un producto por ID
   */
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const { id: userId, role } = req.user;

      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }

      // Verificar permisos: Administradores pueden ver todo, asesores solo sus productos
      if (role !== "ADMINISTRADOR" && product.createdById !== userId) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para ver este producto",
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error al obtener producto:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener producto",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Crear un nuevo producto
   */
  async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id: userId } = req.user;
      const { productType, requestedQuota, franchise, rate } = req.body;

      // Validaciones específicas según el tipo de producto
      if (productType === "TARJETA_DE_CREDITO" && !franchise) {
        return res.status(400).json({
          success: false,
          message: "La franquicia es obligatoria para tarjetas de crédito",
        });
      }

      if (
        ["CREDITO_DE_CONSUMO", "LIBRANZA_LIBRE_INVERSION"].includes(
          productType
        ) &&
        !rate
      ) {
        return res.status(400).json({
          success: false,
          message: "La tasa es obligatoria para créditos y libranzas",
        });
      }

      // Crear producto
      const newProduct = await prisma.product.create({
        data: {
          productType,
          requestedQuota: Number(requestedQuota),
          franchise:
            productType === "TARJETA_DE_CREDITO" ? franchise : undefined,
          rate: ["CREDITO_DE_CONSUMO", "LIBRANZA_LIBRE_INVERSION"].includes(
            productType
          )
            ? parseFloat(rate)
            : undefined,
          status: "ABIERTO",
          createdById: userId,
          updatedById: userId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return res.status(201).json({
        success: true,
        data: newProduct,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      return res.status(500).json({
        success: false,
        message: "Error al crear producto",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Actualizar un producto existente
   */
  async updateProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { id: userId, role } = req.user;
      const { productType, requestedQuota, franchise, rate, status } = req.body;

      // Verificar si el producto existe
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }

      // Verificar permisos: Administradores pueden editar todo, asesores solo sus productos
      if (role !== "ADMINISTRADOR" && product.createdById !== userId) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para actualizar este producto",
        });
      }

      // Validaciones específicas según el tipo de producto
      if (productType === "TARJETA_DE_CREDITO" && !franchise) {
        return res.status(400).json({
          success: false,
          message: "La franquicia es obligatoria para tarjetas de crédito",
        });
      }

      if (
        ["CREDITO_DE_CONSUMO", "LIBRANZA_LIBRE_INVERSION"].includes(
          productType
        ) &&
        !rate
      ) {
        return res.status(400).json({
          success: false,
          message: "La tasa es obligatoria para créditos y libranzas",
        });
      }

      // Actualizar producto
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          productType,
          requestedQuota: Number(requestedQuota),
          franchise: productType === "TARJETA_DE_CREDITO" ? franchise : null,
          rate: ["CREDITO_DE_CONSUMO", "LIBRANZA_LIBRE_INVERSION"].includes(
            productType
          )
            ? parseFloat(rate)
            : null,
          status: status || product.status,
          updatedById: userId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar producto",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Eliminar un producto
   */
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const { id: userId, role } = req.user;

      // Verificar si el producto existe
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }

      // Verificar permisos: Administradores pueden eliminar todo, asesores solo sus productos
      if (role !== "ADMINISTRADOR" && product.createdById !== userId) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para eliminar este producto",
        });
      }

      // Eliminar producto
      await prisma.product.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({
        success: true,
        message: "Producto eliminado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      return res.status(500).json({
        success: false,
        message: "Error al eliminar producto",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Actualizar solo el estado de un producto
   */
  async updateProductStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const { id: userId, role } = req.user;
      const { status } = req.body;

      // Verificar si es un estado válido
      if (!["ABIERTO", "EN_PROCESO", "FINALIZADO"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Estado inválido",
        });
      }

      // Verificar si el producto existe
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Producto no encontrado",
        });
      }

      // Verificar permisos: Administradores pueden actualizar todo, asesores solo sus productos
      if (role !== "ADMINISTRADOR" && product.createdById !== userId) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para actualizar este producto",
        });
      }

      // Actualizar solo el estado
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          status,
          updatedById: userId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: true,
        data: updatedProduct,
      });
    } catch (error) {
      console.error("Error al actualizar estado del producto:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar estado del producto",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = new ProductController();
