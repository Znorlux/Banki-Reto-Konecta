# Banki Finanzas - Sistema de Gestión de Productos Financieros

Banki Finanzas es una aplicación web completa para la gestión y venta de productos financieros, desarrollada como parte de un reto técnico. La aplicación permite a los asesores radicar ventas de diferentes productos financieros y a los administradores gestionar tanto usuarios como las ventas realizadas.

> 👉 [Ver credenciales de prueba](#credenciales-de-prueba) para acceder al sistema

## Características principales

- **Sistema de autenticación seguro** con JWT y validación de captcha
- **Gestión de usuarios** con roles de Administrador y Asesor
- **CRUD completo de productos financieros** 
  - Créditos de Consumo
  - Libranzas de Libre Inversión
  - Tarjetas de Crédito
- **Visualización personalizada** según el rol del usuario
- **Campos dinámicos** según el tipo de producto seleccionado
- **Interfaz moderna y responsive** desarrollada con React y componentes UI avanzados
- **Dockerización completa** para fácil despliegue y desarrollo

## Estructura del proyecto

El proyecto está organizado en dos carpetas principales:

```
/banki-repo
├── /frontend           # Aplicación React (Vite)
│   ├── /src            # Código fuente del frontend
│   │   ├── /components # Componentes reutilizables
│   │   ├── /pages      # Páginas principales
│   │   ├── /context    # Contextos y estado global
│   │   ├── /layout     # Plantillas reutilizables
│   │   ├── /lib        # Generado por shadcn
│   ├── package.json    # Dependencias del frontend
│   └── Dockerfile      # Configuración para el contenedor de Docker
│
└── /backend            # API en Node.js y Express
    ├── /src            # Código fuente del backend
    │   ├── /controllers # Controladores
    │   ├── /routes     # Definición de rutas API
    │   ├── /middleware # Middlewares (auth)
    │   └── /lib        # Modulos reutilizables (ej: instancia de prisma)
    ├── /prisma         # Configuración de ORM y modelos
    ├── package.json    # Dependencias del backend
    ├── .env            # Variables de entorno (requerido)
    └── Dockerfile      # Configuración para Docker
```

## Tecnologías utilizadas

### Frontend
- React 19
- React Router v7
- React Hook Form
- Tailwind CSS con componentes UI personalizados
- Shadcn libreria de componentes UI
- Axios para comunicación con API
- Framer Motion para animaciones

### Backend
- Node.js con Express
- JWT para autenticación
- Prisma ORM para comunicación con la base de datos
- PostgreSQL (alojado en Supabase)
- Bcrypt para encriptación de contraseñas
- Express Validator para validaciones

## Requisitos previos

- Docker y Docker Compose instalados
- Archivo `.env` configurado en la carpeta `/backend`

## Configuración del archivo .env

Crea un archivo `.env` en la carpeta `/backend` con la siguiente estructura:

```
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/base_de_datos
DIRECT_URL=postgresql://usuario:contraseña@host:puerto/base_de_datos
JWT_SECRET=jwt_secret
JWT_EXPIRES_IN=1d
PORT=5000
```

> **Importante**: La aplicación no funcionará correctamente sin el archivo `.env` configurado adecuadamente.

## Cómo ejecutar la aplicación

La aplicación está completamente dockerizada para facilitar su despliegue. Sigue estos pasos:

1. **Clona el repositorio**:
   ```bash
   git clone [https://github.com/tu-usuario/banki.git](https://github.com/Znorlux/Banki-Reto-Konecta.git)
   cd Banki-Reto-Konecta
   ```

2. **Configura el archivo `.env`** en la carpeta `/backend` como se describe arriba.

3. **Ejecuta con Docker Compose**:
   **No olvide iniciar Docker Desktop en su computador**
   ```bash
   docker-compose up -d
   ```

5. **Accede a la aplicación**:
   - Frontend: http://localhost
   - API Backend: http://localhost:5000

Para ver los logs de la aplicación:
```bash
docker-compose logs -f
```

Para detener la aplicación:
```bash
docker-compose down
```

## Credenciales de prueba

- **Administrador**:
  - Email: admin@banki.com
  - Contraseña: Password123

- **Asesor**:
  - Email: paquito@banki.com
  - Contraseña: Password321

## Características implementadas

- ✅ Sistema de login con JWT y captcha
- ✅ CRUD completo de usuarios (solo administradores) + filtros de busqueda
- ✅ CRUD completo de productos financieros
- ✅ Visualización condicional basada en roles
- ✅ Campos dinámicos según tipo de producto
- ✅ Validaciones en frontend y backend
- ✅ Dockerización completa y facil de ejecutar (abierto a optimizaciones de las imagenes)
- ✅ Interfaz de usuario moderna con componentes UI personalizados
- ✅ Visualización de sumatoria de cupos solicitados
- ✅ Modulo de backOffice (en **modales de vista de producto**) + modificación de estado de los productos
- ✅ Encriptación + salteo con bcrypt de las contraseñas de los usuarios para mayor seguridad
- ✅ Principios SOLID en la mayoría de lo posible

## Notas adicionales

- La aplicación está configurada para usar PostgreSQL a través de Supabase, pero puede adaptarse fácilmente a otras bases de datos relacionales modificando las variables de entorno.
- Los contenedores Docker están optimizados para entornos de desarrollo y producción.
