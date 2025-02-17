const express = require('express');
const cors = require('cors'); // Middleware para manejar CORS
const morgan = require('morgan'); // Middleware para registrar solicitudes HTTP
const helmet = require('helmet'); // Middleware para mejorar la seguridad
const cookieParser = require('cookie-parser'); // Middleware para analizar cookies
const authRoutes = require('./routes/auth.routes'); // Rutas de autenticación
const userRoutes = require('./routes/user.routes'); // Rutas de usuarios
const parkingRoutes = require('./routes/parking.routes'); // Rutas de estacionamientos
const swaggerSetup = require('./config/swagger'); // Configuración de Swagger
const { setupSocket } = require('./utils/socket'); // Configuración de Socket.IO

const app = express();

// Middleware para analizar JSON
app.use(express.json());

// Middleware para analizar datos codificados en URL
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar CORS
app.use(cors({
  origin: '*', // Permitir conexiones desde cualquier origen (ajusta según tus necesidades)
  credentials: true, // Habilitar credenciales (cookies, tokens, etc.)
}));

// Middleware para registrar solicitudes HTTP
app.use(morgan('dev'));

// Middleware para mejorar la seguridad
app.use(helmet());

// Middleware para analizar cookies
app.use(cookieParser());

// Configurar Swagger
swaggerSetup(app);

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/users', userRoutes); // Rutas de usuarios
app.use('/api/parkings', parkingRoutes); // Rutas de estacionamientos

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

// Middleware para manejar errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

// Exportar la instancia de Express y el servidor de Socket.IO
module.exports = app;