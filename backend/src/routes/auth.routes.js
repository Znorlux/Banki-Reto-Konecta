const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", authController.login);

// Ruta para generar captcha
router.get("/captcha", authController.generateCaptcha);

// Ruta para obtener información del usuario autenticado
router.get("/me", authMiddleware.protect, authController.getMe);

module.exports = router;
