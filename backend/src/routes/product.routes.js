const express = require("express");
const { check } = require("express-validator");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Proteger todas las rutas (requieren autenticación)
router.use(authMiddleware.protect);

// Ruta para obtener todos los productos (filtrado por rol del usuario)
router.get("/", productController.getAllProducts);

// Ruta para obtener un producto específico por ID
router.get("/:id", productController.getProductById);

// Ruta para crear un nuevo producto
router.post(
  "/",
  [
    check("productType", "El tipo de producto es obligatorio").isIn([
      "CREDITO_DE_CONSUMO",
      "LIBRANZA_LIBRE_INVERSION",
      "TARJETA_DE_CREDITO",
    ]),
    check(
      "requestedQuota",
      "El cupo solicitado es obligatorio y debe ser un número positivo"
    ).isInt({ min: 1 }),
    // Las validaciones para franchise y rate se hacen en el controlador ya que son condicionales
  ],
  productController.createProduct
);

// Ruta para actualizar un producto existente
router.put(
  "/:id",
  [
    check("productType", "El tipo de producto es obligatorio").isIn([
      "CREDITO_DE_CONSUMO",
      "LIBRANZA_LIBRE_INVERSION",
      "TARJETA_DE_CREDITO",
    ]),
    check(
      "requestedQuota",
      "El cupo solicitado es obligatorio y debe ser un número positivo"
    ).isInt({ min: 1 }),
    check("status").optional().isIn(["ABIERTO", "EN_PROCESO", "FINALIZADO"]),
    // Las validaciones para franchise y rate se hacen en el controlador
  ],
  productController.updateProduct
);

// Ruta para actualizar solo el estado de un producto
router.patch(
  "/:id/status",
  [
    check("status", "El estado es obligatorio").notEmpty(),
    check("status", "Estado inválido").isIn([
      "ABIERTO",
      "EN_PROCESO",
      "FINALIZADO",
    ]),
  ],
  productController.updateProductStatus
);

// Ruta para eliminar un producto
router.delete("/:id", productController.deleteProduct);

module.exports = router;
