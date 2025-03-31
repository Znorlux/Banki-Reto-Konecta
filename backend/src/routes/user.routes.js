const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Proteger todas las rutas de usuarios (requieren autenticación)
router.use(authMiddleware.protect);

// Las operaciones de usuarios solo pueden ser realizadas por administradores, tal y como se nos pidió en el doc
router.use(authMiddleware.restrictTo("ADMINISTRADOR"));

// OBTENER TODOS LOS USUARIOS
router.get("/", userController.getAllUsers);
// OBTENER UN USUARIO POR ID
router.get("/:id", userController.getUserById);
// CREAR UN NUEVO USUARIO
router.post("/", userController.createUser);
// ACTUALIZAR UN USUARIO POR ID
router.put("/:id", userController.updateUser);
// ELIMINAR UN USUARIO POR ID
router.delete("/:id", userController.deleteUser);

module.exports = router;
