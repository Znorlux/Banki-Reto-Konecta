const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

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
