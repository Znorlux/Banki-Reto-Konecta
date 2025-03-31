const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt"); // ADICION PARA LA PRUEBA :)

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
   * Obtener un usuario por ID
   * @param {Object} req - Objeto de solicitud de Express
   * @param {Object} res - Objeto de respuesta de Express
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
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
      console.error("Error al obtener usuario:", error);
      return res.status(500).json({
        success: false,
        message: "Error al obtener usuario",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Crear un nuevo usuario
   * @param {Object} req - Objeto de solicitud de Express
   * @param {Object} res - Objeto de respuesta de Express
   */
  /*
      EJEMPLO DE COMO CREAR UN USUARIO CON ROL POR DEFECTO 
        {
          "name": "Paquito Asesor",
          "email": "asesor1@banki.com",
          "password": "Password123",
          "role": "ASESOR"
        }
        role options: ADMINISTRADOR || ASESOR
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

      // Hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword, // Ahora guardamos la contraseña hasheada
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

  /**
   * Actualizar un usuario existente
   * @param {Object} req - Objeto de solicitud de Express
   * @param {Object} res - Objeto de respuesta de Express
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, role } = req.body;

      // Verificar si el usuario existe
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      // Verificar si el nuevo email ya está en uso (y no es del mismo usuario)
      if (email && email !== user.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });

        if (emailExists) {
          return res.status(400).json({
            success: false,
            message: "Este email ya está registrado por otro usuario",
          });
        }
      }

      // Preparar datos para actualizar
      const updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;

      // Si hay nueva contraseña, claro que debemos hashearla
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      // Actualizar usuario
      const updatedUser = await prisma.user.update({
        where: { id: Number(id) },
        data: updateData,
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
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar usuario",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Eliminar un usuario
   * @param {Object} req - Objeto de solicitud de Express
   * @param {Object} res - Objeto de respuesta de Express
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Verificar si el usuario existe
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      // Verificar si es el último administrador
      if (user.role === "ADMINISTRADOR") {
        const adminCount = await prisma.user.count({
          where: { role: "ADMINISTRADOR" },
        });

        if (adminCount <= 1) {
          return res.status(400).json({
            success: false,
            message: "No se puede eliminar el último administrador del sistema",
          });
        }
      }

      // Eliminar usuario
      await prisma.user.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({
        success: true,
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return res.status(500).json({
        success: false,
        message: "Error al eliminar usuario",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = new UserController();
