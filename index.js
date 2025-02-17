require('dotenv').config({ path: '.env' });
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
require('./config/swagger')(app); 
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Docs',
      version: '1.0.0'
    },
    servers: [{ url: `http://localhost:${process.env.PORT}` }]
  },
  apis: ['./routes/*.js'], // Asegurar que la ruta sea correcta
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  if (process.env.NODE_ENV === 'development') {
    // Middleware específico para desarrollo
    app.use('/dev/docs', swaggerUi.serve);
    app.get('/dev/docs', swaggerUi.setup(specs, {
      explorer: true,
      customSiteTitle: 'DEV API Docs'
    }));
  }
};
// Middlewares básicos
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
connectDB();

// Rutas
app.use('/api', require('./routes/userRoutes'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', `[${new Date().toLocaleTimeString()}]`); // Color cyan para la hora
  console.log('\x1b[32m%s\x1b[0m', `Servidor activo en: http://localhost:${PORT}`); // Color verde
});