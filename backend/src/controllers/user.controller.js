const prisma = require("../lib/prisma");

/**
 * Controlador básico para operaciones CRUD de usuarios
 */
class UserController {
  /**
   * Obtener todos los usuarios
   * @param {Object} req - Objeto de solicitud de Express
   * @param {Object} res - Objeto de respuesta de Express
   */
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener usuarios",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Crear un nuevo usuario (prueba básica)
   * @param {Object} req - Objeto de solicitud de Express
   * @param {Object} res - Objeto de respuesta de Express
   */
  async createUser(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Validar campos requeridos
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Falta uno de los campos obligatorios, por favor proporcione nombre, email y contraseña",
        });
      }

      // Verificar si el email ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Este email ya está registrado",
        });
      }

      // Crear nuevo usuario

      {
        /*
      EJEMPLO DE CREACIÓN DE USUARIO CON ROL POR DEFECTO 
        {
          "name": "Paquito Asesor",
          "email": "asesor1@banki.com",
          "password": "Password123",
          "role": "ASESOR"
      }
          role options: ADMIN || ASESOR
      */
      }
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password, // poquita seguridad, ojo
          role: role || "ASESOR", // Por defecto es ASESOR si no se especifica
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return res.status(500).json({
        success: false,
        message: "Error al crear usuario",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = new UserController();
