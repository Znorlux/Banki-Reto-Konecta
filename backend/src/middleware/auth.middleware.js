const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

/**
 * Middleware para proteger rutas, usando el token JWT
 */
exports.protect = async (req, res, next) => {
  try {
    // Obtener el token del header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Verificar que el token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No autorizado. Token no proporcionado.",
      });
    }

    // Verificar el token
    try {
      // Decodificar el token
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
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "El usuario asociado a este token ya no existe",
        });
      }

      // Agregar el usuario al objeto de request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }
  } catch (error) {
    console.error("Error en middleware de autenticación:", error);
    return res.status(500).json({
      success: false,
      message: "Error en el servidor durante la autenticación",
    });
  }
};

/**
 * Middleware para restringir el acceso según roles
 * @param  {...string} roles - Roles permitidos
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Verificar si el rol del usuario está entre los roles permitidos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para realizar esta acción",
      });
    }
    next();
  };
};
