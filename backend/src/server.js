const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Importar rutas
const userRoutes = require("./routes/user.routes");

// Inicializar app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);

// Ruta para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la API de Banki Finanzas" });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;
