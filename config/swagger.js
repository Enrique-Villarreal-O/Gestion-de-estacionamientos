const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const setupSwagger = (app) => {
  const specs = swaggerJsdoc(options);
  
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(specs, {
    swaggerOptions: {
      authAction: {
        bearerAuth: {
          name: 'bearerAuth',
          schema: {
            type: 'http',
            in: 'header',
            name: 'Authorization',
            description: 'Ingrese el token JWT anteponiendo "Bearer "',
            scheme: 'bearer'
          },
          value: 'Bearer <Tu token aquí>'
        }
      }
    }
  }));
};

// Configuración mejorada
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Docs',
      version: '1.0.0'
    },
    servers: [{
      url: `http://localhost:${process.env.PORT || 5000}/api`,
      description: 'Servidor Local'
    }]
  },
  apis: ['./routes/**/*.js'] // Asegurar rutas correctas
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  // Middleware específico para desarrollo
  if (process.env.NODE_ENV === 'development') {
    // Ruta para la UI
    app.use('/dev/docs', swaggerUi.serve);
    app.get('/dev/docs', swaggerUi.setup(specs));
    
    // Ruta para el JSON
    app.get('/dev/docs.json', (req, res) => {
      res.json(specs);
    });
    
    console.log('📚 Swagger disponible en:');
    console.log(`- UI: http://localhost:${process.env.PORT}/dev/docs`);
    console.log(`- JSON: http://localhost:${process.env.PORT}/dev/docs.json`);
  }
};