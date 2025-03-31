const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Controlador para la autenticación de usuarios
 */
class AuthController {
  /**
   * Iniciar sesión de un usuario
   * @param {Object} req - Objeto de solicitud de Express
   * @param {Object} res - Objeto de respuesta de Express
   */
  async login(req, res) {
    try {
      const { email, password, captcha } = req.body;

      // Validar campos requeridos
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Por favor proporcione email y contraseña",
        });
      }

      // En un entorno de producción, verificaríamos el captcha aquí
      // Por ahora, para pruebas, lo omitimos

      // Buscar usuario por email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Verificar si el usuario existe
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciales incorrectas",
        });
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Credenciales incorrectas",
        });
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || "jwt_temporal",
        { expiresIn: "24h" }
      );

      // Retornar el token y datos del usuario (sin contraseña)
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      return res.status(500).json({
        success: false,
        message: "Error en el servidor durante la autenticación",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Generar un captcha (simplificado para pruebas)
   * @param {Object} req - Objeto de solicitud de Express
   * @param {Object} res - Objeto de respuesta de Express
   */
  generateCaptcha(req, res) {
    try {
      // generacion sencillita del captcha -
      const captcha = Math.random().toString(36).substring(2, 8).toUpperCase(); // captcha aleatorio de 6 caracteres
      return res.status(200).json({
        success: true,
        captcha,
      });
    } catch (error) {
      console.error("Error generando captcha:", error);
      return res.status(500).json({
        success: false,
        message: "Error generando captcha",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Verificar el token JWT y obtener información del usuario autenticado
   * @param {Object} req - Objeto de solicitud de Express
   * @param {Object} res - Objeto de respuesta de Express
   */
  async getMe(req, res) {
    try {
      // El usuario debería ser extraído del middleware de autenticación
      // Por ahora implementamos la lógica aquí

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "No autorizado. Token no proporcionado.",
        });
      }

      const token = authHeader.split(" ")[1];

      try {
        // Verificar el token
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "mi_secreto_temporal"
        );

        // Buscar el usuario en la base de datos
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "Usuario no encontrado",
          });
        }

        return res.status(200).json({
          success: true,
          data: user,
        });
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Token inválido o expirado",
        });
      }
    } catch (error) {
      console.error("Error en getMe:", error);
      return res.status(500).json({
        success: false,
        message: "Error en el servidor",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = new AuthController();
