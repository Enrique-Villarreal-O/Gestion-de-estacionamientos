const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Versión de OpenAPI
    info: {
      title: 'Parking App API', // Título de la API
      version: '1.0.0', // Versión de la API
      description: 'API para gestionar usuarios, estacionamientos y ofertas de alquiler.', // Descripción
      contact: {
        name: 'Soporte Técnico',
        email: 'support@parkingapp.com',
      },
      servers: [
        {
          url: 'http://localhost:5000', // URL del servidor local
          description: 'Servidor de desarrollo',
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Requiere autenticación JWT para todos los endpoints protegidos
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Rutas a escanear para generar la documentación
};

// Generar documentación de Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware para integrar Swagger UI
const swaggerSetup = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = swaggerSetup;